import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { Effect } from "effect";
import { downloadCoverById } from "../api/usdb/cover.ts";
import { getLyricsById } from "../api/usdb/lyrics.ts";
import type { Song } from "../api/usdb/search.ts";
import type { YoutubeLink } from "../api/usdb/youtube.ts";
import { getYoutubeLinksById } from "../api/usdb/youtube.ts";
import { downloadYoutubeVideoWithProgress } from "../api/youtube/download.ts";
import type { YoutubeVideo } from "../api/youtube/search.ts";
import { searchYoutubeVideos } from "../api/youtube/search.ts";

export type DownloadSongParams = {
  song: Song;
  cookie: string;
  baseDir?: string; // defaults to CWD/songs
  onProgress?: (p: number) => void; // 0..1
};

export type DownloadSongResult = {
  dirName: string;
  songDir: string;
};

const sanitizeForPath = (name: string) =>
  name
    .replace(/[\\/:"*?<>|]+/g, " ")
    .replace(/\s+/g, " ")
    .replace(/\./g, "")
    .trim();

const normalizeYoutubeLink = (videoLink: string): string =>
  /^(https?:)?\/\//.test(videoLink)
    ? videoLink
    : `https://youtu.be/${videoLink}`;

const uniqueLinks = (links: string[]): string[] => {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const link of links) {
    const normalized = normalizeYoutubeLink(link);
    if (seen.has(normalized)) continue;
    seen.add(normalized);
    result.push(normalized);
  }
  return result;
};

const downloadVideoFromLinks = (
  links: string[],
  outputPath: string,
  searchQuery: string,
  onProgress?: (p: number) => void,
): Effect.Effect<void, Error> =>
  Effect.gen(function* () {
    const errors: string[] = [];
    const tried = new Set<string>();

    const tryLink = (link: string) =>
      Effect.gen(function* () {
        if (tried.has(link)) return false;
        tried.add(link);
        const result = yield* Effect.either(
          downloadYoutubeVideoWithProgress(link, outputPath, (p) =>
            onProgress?.(p.percent ?? 0),
          ),
        );
        if (result._tag === "Right") return true;
        errors.push(result.left.message);
        return false;
      });

    for (const link of links) {
      if (yield* tryLink(link)) return;
    }

    const searchResults = yield* Effect.catchAll(
      searchYoutubeVideos(searchQuery),
      () => Effect.succeed<YoutubeVideo[]>([]),
    );
    for (const video of searchResults) {
      const link = normalizeYoutubeLink(video.url || video.id);
      if (yield* tryLink(link)) return;
    }

    return yield* Effect.fail(
      new Error(errors.join("; ") || "Failed to download youtube video"),
    );
  });

export const downloadSong = (
  params: DownloadSongParams,
): Effect.Effect<DownloadSongResult, Error> =>
  Effect.gen(function* () {
    const { song, cookie, onProgress } = params;
    const baseDir = params.baseDir ?? join(process.cwd(), "songs");

    const dirName = sanitizeForPath(`${song.artist} - ${song.title}`);
    const songDir = join(baseDir, dirName);

    // ensure directories
    yield* Effect.tryPromise({
      try: async () => {
        await mkdir(baseDir, { recursive: true });
        await mkdir(songDir, { recursive: true });
      },
      catch: (e) =>
        e instanceof Error ? e : new Error("Failed to create directories"),
    });

    const usdbLinks = yield* Effect.catchAll(
      getYoutubeLinksById(song.apiId, cookie),
      () => Effect.succeed<YoutubeLink[]>([]),
    );
    const videoLinks = uniqueLinks(
      usdbLinks.map((item) => item.link).filter(Boolean),
    );

    // Parallel: cover, lyrics, and video download (with progress)
    const coverEff = Effect.gen(function* () {
      const coverBytes = yield* Effect.catchAll(
        downloadCoverById(song.apiId, cookie),
        () => Effect.succeed<Uint8Array | null>(null),
      );
      if (coverBytes) {
        yield* Effect.tryPromise({
          try: async () => {
            await writeFile(join(songDir, "cover.jpg"), coverBytes);
          },
          catch: (e) =>
            e instanceof Error ? e : new Error("Failed to write cover"),
        });
      }
    });

    const lyricsEff = Effect.gen(function* () {
      const parsed = yield* getLyricsById(song.apiId, cookie);
      if (!parsed) return;
      const headers = {
        ...parsed.headers,
        mp3: "video.mp4",
        video: "video.mp4",
        cover: "cover.jpg",
      } as Record<string, string | undefined>;
      const headerLines = Object.entries(headers)
        .filter(([, v]) => v != null && String(v).trim().length > 0)
        .map(([k, v]) => `#${k.toUpperCase()}:${v}`)
        .join("\n");
      const content = `${headerLines}\n${parsed.lyrics.trim()}\n`;
      yield* Effect.tryPromise({
        try: async () => {
          await writeFile(join(songDir, "song.txt"), content);
        },
        catch: (e) =>
          e instanceof Error ? e : new Error("Failed to write lyrics"),
      });
    });

    const videoEff = downloadVideoFromLinks(
      videoLinks,
      join(songDir, "video.mp4"),
      `${song.artist} ${song.title}`,
      onProgress,
    );

    // run in parallel
    yield* Effect.all([coverEff, lyricsEff, videoEff], { concurrency: 3 });

    return { dirName, songDir } as DownloadSongResult;
  });
