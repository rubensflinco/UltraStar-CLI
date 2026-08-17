import { access, mkdir, unlink, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { Effect } from "effect";
import { normalizeSongDirectory } from "../api/audio/normalize.ts";
import { downloadCoverById } from "../api/usdb/cover.ts";
import { getLyricsById, type ParsedLyrics } from "../api/usdb/lyrics.ts";
import type { Song } from "../api/usdb/search.ts";
import type { YoutubeLink } from "../api/usdb/youtube.ts";
import {
  getYoutubeLinksById,
  normalizeYoutubeLink,
  parseVideoMetaResources,
  selectDownloadSources,
} from "../api/usdb/youtube.ts";
import { downloadYoutubeVideoWithProgress } from "../api/youtube/download.ts";
import type { YoutubeVideo } from "../api/youtube/search.ts";
import { searchYoutubeVideos } from "../api/youtube/search.ts";

export type DownloadSongParams = {
  song: Song;
  cookie: string;
  baseDir?: string; // defaults to CWD/songs
  targetPeakDb?: number;
  onProgress?: (p: number) => void; // 0..1
};

export type DownloadSongResult = {
  dirName: string;
  songDir: string;
};

const AUDIO_SOURCE_TMP = ".audio-source.tmp.mp4";

const sanitizeForPath = (name: string) =>
  name
    .replace(/[\\/:"*?<>|]+/g, " ")
    .replace(/\s+/g, " ")
    .replace(/\./g, "")
    .trim();

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

const downloadFromLinks = (
  links: string[],
  outputPath: string,
  searchQuery: string | null,
  onProgress?: (percent: number) => void,
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

    for (const link of uniqueLinks(links)) {
      if (yield* tryLink(link)) return;
    }

    if (searchQuery) {
      const searchResults = yield* Effect.catchAll(
        searchYoutubeVideos(searchQuery),
        () => Effect.succeed<YoutubeVideo[]>([]),
      );
      for (const video of searchResults) {
        const link = normalizeYoutubeLink(video.url || video.id);
        if (yield* tryLink(link)) return;
      }
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

    yield* Effect.tryPromise({
      try: async () => {
        await mkdir(baseDir, { recursive: true });
        await mkdir(songDir, { recursive: true });
      },
      catch: (e) =>
        e instanceof Error ? e : new Error("Failed to create directories"),
    });

    const [usdbLinks, parsedLyrics] = yield* Effect.all(
      [
        Effect.catchAll(getYoutubeLinksById(song.apiId, cookie), () =>
          Effect.succeed<YoutubeLink[]>([]),
        ),
        Effect.catchAll(getLyricsById(song.apiId, cookie), () =>
          Effect.succeed<ParsedLyrics>(null),
        ),
      ],
      { concurrency: 2 },
    );

    const meta = parseVideoMetaResources(parsedLyrics?.headers.video);
    const sources = selectDownloadSources(usdbLinks, meta);
    const searchQuery = `${song.artist} ${song.title}`;
    const videoPath = join(songDir, "video.mp4");
    const audioTmpPath = join(songDir, AUDIO_SOURCE_TMP);

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
      if (!parsedLyrics) return;
      const headers = {
        ...parsedLyrics.headers,
        mp3: "audio.mp3",
        video: "video.mp4",
        cover: "cover.jpg",
      } as Record<string, string | undefined>;
      const headerLines = Object.entries(headers)
        .filter(([, v]) => v != null && String(v).trim().length > 0)
        .map(([k, v]) => `#${k.toUpperCase()}:${v}`)
        .join("\n");
      const content = `${headerLines}\n${parsedLyrics.lyrics.trim()}\n`;
      yield* Effect.tryPromise({
        try: async () => {
          await writeFile(join(songDir, "song.txt"), content);
        },
        catch: (e) =>
          e instanceof Error ? e : new Error("Failed to write lyrics"),
      });
    });

    let videoProgress = 0;
    let audioProgress = 0;
    const emitProgress = () => {
      if (!onProgress) return;
      if (sources.separateAudio) {
        onProgress(Math.min(0.92, videoProgress * 0.5 + audioProgress * 0.42));
        return;
      }
      onProgress(Math.min(0.92, videoProgress));
    };

    const videoEff = downloadFromLinks(
      sources.videoLinks,
      videoPath,
      searchQuery,
      (percent) => {
        videoProgress = percent;
        emitProgress();
      },
    );

    const mediaEffs: Array<Effect.Effect<void, Error>> = [
      coverEff,
      lyricsEff,
      videoEff,
    ];

    if (sources.separateAudio) {
      mediaEffs.push(
        Effect.catchAll(
          downloadFromLinks(
            sources.audioLinks,
            audioTmpPath,
            null,
            (percent) => {
              audioProgress = percent;
              emitProgress();
            },
          ),
          () => Effect.void,
        ),
      );
    }

    yield* Effect.all(mediaEffs, { concurrency: 4 });

    onProgress?.(0.95);
    const hasSeparateAudioFile = sources.separateAudio
      ? yield* Effect.promise(() =>
          access(audioTmpPath)
            .then(() => true)
            .catch(() => false),
        )
      : false;
    yield* normalizeSongDirectory(
      songDir,
      dirName,
      params.targetPeakDb,
      hasSeparateAudioFile ? audioTmpPath : undefined,
    );
    yield* Effect.promise(() => unlink(audioTmpPath).catch(() => undefined));
    onProgress?.(1);

    return { dirName, songDir } as DownloadSongResult;
  });
