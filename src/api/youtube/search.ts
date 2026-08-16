import { spawn } from "node:child_process";
import { Effect } from "effect";
import { checkYtDlpAvailable } from "./check.ts";
import { getInnertube } from "./client.ts";

export type YoutubeThumbnail = {
  url: string;
  id?: string;
  height?: number;
  width?: number;
};

export type YoutubeVideo = {
  id: string;
  url: string;
  title: string;
  description: null;
  duration: number;
  channel_id: string;
  channel: string;
  channel_url: string;
  thumbnails: YoutubeThumbnail[];
  view_count: number;
  channel_is_verified: boolean;
};

const mapSearchNode = (node: unknown): YoutubeVideo | null => {
  if (!node || typeof node !== "object") return null;
  const item = node as {
    type?: string;
    video_id?: string;
    id?: string;
    title?: { toString: () => string };
    duration?: { seconds?: number };
    author?: { id?: string; name?: string; url?: string };
    thumbnails?: Array<{ url?: string; height?: number; width?: number }>;
  };

  if (item.type === "ReelItem" || item.type === "ShortsLockupView") return null;

  const id =
    typeof item.video_id === "string"
      ? item.video_id
      : typeof item.id === "string" && item.id.length === 11
        ? item.id
        : null;
  if (!id) return null;

  const title =
    item.title && typeof item.title.toString === "function"
      ? item.title.toString()
      : "";

  return {
    id,
    url: `https://www.youtube.com/watch?v=${id}`,
    title,
    description: null,
    duration: item.duration?.seconds ?? 0,
    channel_id: item.author?.id ?? "",
    channel: item.author?.name ?? "",
    channel_url: item.author?.url ?? "",
    thumbnails: (item.thumbnails ?? [])
      .filter((thumb) => typeof thumb.url === "string")
      .map((thumb) => ({
        url: thumb.url as string,
        height: thumb.height,
        width: thumb.width,
      })),
    view_count: 0,
    channel_is_verified: false,
  };
};

const searchYoutubeVideosNative = (
  search: string,
): Effect.Effect<YoutubeVideo[], Error, never> =>
  Effect.tryPromise({
    try: async () => {
      const yt = await getInnertube();
      const results = await yt.search(search, { type: "video" });
      const videos: YoutubeVideo[] = [];
      for (const node of results.videos) {
        const mapped = mapSearchNode(node);
        if (!mapped) continue;
        videos.push(mapped);
        if (videos.length >= 5) break;
      }
      if (videos.length === 0) {
        throw new Error("No YouTube search results");
      }
      return videos;
    },
    catch: (e) =>
      e instanceof Error ? e : new Error("Failed to search youtube"),
  });

/**
 * Search youtube videos using yt-dlp and parse JSONL output.
 */
const searchYoutubeVideosYtDlp = (
  search: string,
): Effect.Effect<YoutubeVideo[], Error, never> =>
  Effect.tryPromise({
    try: async () => {
      const args = [
        "--match-filters",
        "original_url!*=/shorts/",
        `ytsearch5:${search}`,
        "--flat-playlist",
        "-j",
        "--no-simulate",
      ];

      const result = await new Promise<string>((resolve, reject) => {
        const child = spawn("yt-dlp", args, {
          stdio: ["ignore", "pipe", "pipe"],
        });
        let stdout = "";
        let stderr = "";

        child.stdout.setEncoding("utf8");
        child.stdout.on("data", (chunk) => {
          stdout += chunk as string;
        });
        child.stderr.setEncoding("utf8");
        child.stderr.on("data", (chunk) => {
          stderr += chunk as string;
        });
        child.on("error", (err) => reject(err));
        child.on("close", (code) => {
          if (code === 0) resolve(stdout);
          else
            reject(
              new Error(
                `yt-dlp search failed (code ${code}): ${stderr.trim()}`,
              ),
            );
        });
      });

      const json = `[${result.split("\n").filter(Boolean).join(",")} ]`;
      return JSON.parse(json) as YoutubeVideo[];
    },
    catch: (e) =>
      e instanceof Error ? e : new Error("Failed to search youtube"),
  });

/**
 * Search youtube videos. Tries the native InnerTube client first, then yt-dlp.
 */
export const searchYoutubeVideos = (
  search: string,
): Effect.Effect<YoutubeVideo[], Error, never> =>
  searchYoutubeVideosNative(search).pipe(
    Effect.catchAll((nativeError) =>
      checkYtDlpAvailable.pipe(
        Effect.flatMap((available) =>
          available
            ? searchYoutubeVideosYtDlp(search)
            : Effect.fail(nativeError),
        ),
      ),
    ),
  );
