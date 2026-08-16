import { spawn } from "node:child_process";
import { once } from "node:events";
import { createWriteStream } from "node:fs";
import { unlink } from "node:fs/promises";
import { Effect } from "effect";
import { Utils } from "youtubei.js";
import { checkYtDlpAvailable } from "./check.ts";
import {
  getInnertube,
  YOUTUBE_DOWNLOAD_CLIENTS,
  type YoutubeDownloadClient,
} from "./client.ts";
import { checkFfmpegAvailable, muxVideoAudio } from "./ffmpeg.ts";
import { extractYoutubeVideoId } from "./videoId.ts";

export type YoutubeDownloadProgress = {
  percent: number; // 0..1
  eta?: string;
  speed?: string;
};

type StreamFormat = {
  itag: number;
  mime_type: string;
  has_audio: boolean;
  has_video: boolean;
  height?: number;
  bitrate: number;
  content_length?: number;
  url?: string;
  signature_cipher?: string;
  cipher?: string;
};

const hasDownloadUrl = (format: StreamFormat): boolean =>
  Boolean(format.url || format.signature_cipher || format.cipher);

type VideoInfo = Awaited<
  ReturnType<Awaited<ReturnType<typeof getInnertube>>["getBasicInfo"]>
>;

type YtDlpProgressData = {
  type: "progress";
  downloaded: number | string;
  total: "NA" | string;
  frag_index: number | string;
  frag_count: number | string;
};

const MIN_FILE_BYTES = 1024;

const removeFile = async (path: string): Promise<void> => {
  await unlink(path).catch(() => undefined);
};

const writeWebStreamToFile = async (
  stream: ReadableStream<Uint8Array>,
  filePath: string,
  onBytes?: (n: number) => void,
): Promise<number> => {
  const file = createWriteStream(filePath);
  let bytes = 0;
  try {
    for await (const chunk of Utils.streamToIterable(stream)) {
      bytes += chunk.byteLength;
      onBytes?.(chunk.byteLength);
      if (!file.write(chunk)) {
        await once(file, "drain");
      }
    }
    await new Promise<void>((resolve, reject) => {
      file.end((err: Error | null | undefined) => {
        if (err) reject(err);
        else resolve();
      });
    });
    if (bytes < MIN_FILE_BYTES) {
      throw new Error("Downloaded file is empty or too small");
    }
    return bytes;
  } catch (error) {
    file.destroy();
    await removeFile(filePath);
    throw error;
  }
};

const pickAdaptiveVideo = (info: VideoInfo): StreamFormat | null => {
  const formats = info.streaming_data?.adaptive_formats ?? [];
  const candidates = formats.filter(
    (format) =>
      format.has_video &&
      !format.has_audio &&
      format.mime_type.includes("avc") &&
      typeof format.height === "number" &&
      format.height <= 1080 &&
      hasDownloadUrl(format),
  );
  candidates.sort(
    (a, b) => (b.height ?? 0) - (a.height ?? 0) || b.bitrate - a.bitrate,
  );
  return candidates[0] ?? null;
};

const pickAdaptiveAudio = (info: VideoInfo): StreamFormat | null => {
  const formats = info.streaming_data?.adaptive_formats ?? [];
  const candidates = formats.filter(
    (format) =>
      format.has_audio &&
      !format.has_video &&
      format.mime_type.includes("mp4") &&
      hasDownloadUrl(format),
  );
  candidates.sort((a, b) => b.bitrate - a.bitrate);
  return candidates[0] ?? null;
};

const pickCombinedFormat = (info: VideoInfo): StreamFormat | null => {
  const formats = [
    ...(info.streaming_data?.formats ?? []),
    ...(info.streaming_data?.adaptive_formats ?? []),
  ];
  const candidates = formats.filter(
    (format) =>
      format.has_audio &&
      format.has_video &&
      format.mime_type.includes("mp4") &&
      hasDownloadUrl(format),
  );
  candidates.sort((a, b) => (b.height ?? 0) - (a.height ?? 0));
  return candidates[0] ?? null;
};

type LoadedVideo = {
  info: VideoInfo;
  client: YoutubeDownloadClient;
};

const isPlayable = (info: VideoInfo): boolean => {
  const status = info.playability_status?.status;
  return !status || status === "OK";
};

const loadVideoInfo = async (link: string): Promise<LoadedVideo> => {
  const videoId = extractYoutubeVideoId(link);
  if (!videoId) {
    throw new Error("Could not extract YouTube video ID");
  }

  const yt = await getInnertube();
  let lastError: Error | null = null;

  for (const client of YOUTUBE_DOWNLOAD_CLIENTS) {
    try {
      const info = await yt.getBasicInfo(videoId, { client });
      if (isPlayable(info)) {
        return { info, client };
      }
      lastError = new Error(
        `Video is not playable (${info.playability_status?.status})`,
      );
      if (info.playability_status?.status === "UNPLAYABLE") {
        break;
      }
    } catch (error) {
      lastError =
        error instanceof Error
          ? error
          : new Error("Failed to load youtube video info");
    }
  }

  throw lastError ?? new Error("Failed to load youtube video info");
};

const downloadNativeAdaptive = async (
  loaded: LoadedVideo,
  path: string,
  onProgress: (p: YoutubeDownloadProgress) => void,
): Promise<void> => {
  const { info, client } = loaded;
  const videoFormat = pickAdaptiveVideo(info);
  const audioFormat = pickAdaptiveAudio(info);
  if (!videoFormat || !audioFormat) {
    throw new Error("No adaptive video+audio formats available");
  }

  const videoTmp = `${path}.video.tmp`;
  const audioTmp = `${path}.audio.tmp`;
  let downloaded = 0;
  const total =
    (videoFormat.content_length ?? 0) + (audioFormat.content_length ?? 0);
  const onBytes = (n: number) => {
    downloaded += n;
    if (total > 0) {
      onProgress({
        percent: Math.max(0, Math.min(0.95, downloaded / total)),
      });
    }
  };

  try {
    const [videoStream, audioStream] = await Promise.all([
      info.download({
        itag: videoFormat.itag,
        type: "video",
        client,
      }),
      info.download({
        itag: audioFormat.itag,
        type: "audio",
        client,
      }),
    ]);

    await Promise.all([
      writeWebStreamToFile(videoStream, videoTmp, onBytes),
      writeWebStreamToFile(audioStream, audioTmp, onBytes),
    ]);

    await Effect.runPromise(muxVideoAudio(videoTmp, audioTmp, path));
    onProgress({ percent: 1 });
  } finally {
    await Promise.all([removeFile(videoTmp), removeFile(audioTmp)]);
  }
};

const downloadNativeCombined = async (
  loaded: LoadedVideo,
  path: string,
  onProgress: (p: YoutubeDownloadProgress) => void,
): Promise<void> => {
  const { info, client } = loaded;
  const combined = pickCombinedFormat(info);
  if (!combined) {
    throw new Error("No combined video+audio format available");
  }

  const stream = await info.download({
    itag: combined.itag,
    type: "video+audio",
    format: "mp4",
    client,
  });

  let downloaded = 0;
  const total = combined.content_length ?? 0;
  await writeWebStreamToFile(stream, path, (n) => {
    downloaded += n;
    if (total > 0) {
      onProgress({ percent: Math.max(0, Math.min(0.99, downloaded / total)) });
    }
  });
  onProgress({ percent: 1 });
};

const parseYtDlpProgressLine = (
  line: string,
  onProgress: (p: YoutubeDownloadProgress) => void,
): void => {
  try {
    const raw = line.trim();
    if (raw.length === 0) return;
    const maybeUnwrapped =
      (raw.startsWith("'") && raw.endsWith("'")) ||
      (raw.startsWith('"') && raw.endsWith('"'))
        ? raw.slice(1, -1)
        : raw;
    const data = JSON.parse(maybeUnwrapped) as YtDlpProgressData;

    if (data.type !== "progress") return;

    let percent = 0;
    const toNumber = (v: unknown): number => {
      if (typeof v === "number") return v;
      const n = Number.parseInt(String(v), 10);
      return Number.isNaN(n) ? Number.NaN : n;
    };

    if (data.total !== "NA") {
      const total = toNumber(data.total);
      const downloaded = toNumber(data.downloaded);
      if (!Number.isNaN(total) && total > 0 && !Number.isNaN(downloaded)) {
        percent = Math.max(0, Math.min(1, downloaded / total));
      } else {
        const fragCount = toNumber(data.frag_count);
        const fragIndex = toNumber(data.frag_index);
        if (
          !Number.isNaN(fragCount) &&
          fragCount > 0 &&
          !Number.isNaN(fragIndex)
        ) {
          percent = Math.max(
            0,
            Math.min(1, Math.min(fragIndex, fragCount) / fragCount),
          );
        }
      }
    } else {
      const fragCount = toNumber(data.frag_count);
      const fragIndex = toNumber(data.frag_index);
      if (
        !Number.isNaN(fragCount) &&
        fragCount > 0 &&
        !Number.isNaN(fragIndex)
      ) {
        percent = Math.max(
          0,
          Math.min(1, Math.min(fragIndex, fragCount) / fragCount),
        );
      }
    }

    onProgress({ percent });
  } catch {
    // Ignore lines that aren't valid JSON
  }
};

const downloadYtDlpWithProgress = (
  link: string,
  path: string,
  onProgress: (p: YoutubeDownloadProgress) => void,
): Promise<void> =>
  new Promise<void>((resolve, reject) => {
    const args = [
      "-S",
      "ext,res:1080",
      "-o",
      path,
      "--quiet",
      "--newline",
      "--no-warnings",
      "--progress",
      "--progress-template",
      `{"type": "progress", "downloaded": "%(progress.downloaded_bytes)s", "total": "%(progress.total_bytes)s", "frag_index": "%(progress.fragment_index)s", "frag_count": "%(progress.fragment_count)s"}`,
      "--",
      link,
    ];

    const child = spawn("yt-dlp", args, {
      stdio: ["ignore", "pipe", "pipe"],
    });

    child.stderr.setEncoding("utf8");
    child.stderr.on("data", (chunk) => {
      (chunk as string).split(/[\r\n]+/).forEach((line) => {
        parseYtDlpProgressLine(line, onProgress);
      });
    });
    child.stdout.setEncoding("utf8");
    child.stdout.on("data", (chunk) => {
      (chunk as string).split(/[\r\n]+/).forEach((line) => {
        parseYtDlpProgressLine(line, onProgress);
      });
    });
    child.on("error", (err) => reject(err));
    child.on("close", (code) => {
      if (code === 0) {
        onProgress({ percent: 1 });
        resolve();
      } else {
        reject(new Error(`yt-dlp download failed (code ${code})`));
      }
    });
  });

const toError = (e: unknown, fallback: string): Error =>
  e instanceof Error ? e : new Error(fallback);

const resetDownload = (
  path: string,
  onProgress: (p: YoutubeDownloadProgress) => void,
): Effect.Effect<void, never, never> =>
  Effect.tryPromise({
    try: async () => {
      onProgress({ percent: 0 });
      await removeFile(path);
    },
    catch: () => undefined,
  }).pipe(Effect.catchAll(() => Effect.void));

/**
 * Native InnerTube (best quality) → yt-dlp → native combined stream.
 * UNPLAYABLE / missing formats skip native and still try yt-dlp.
 */
const downloadWithFallback = (
  link: string,
  path: string,
  onProgress: (p: YoutubeDownloadProgress) => void,
): Effect.Effect<void, Error, never> =>
  Effect.gen(function* () {
    const errors: string[] = [];

    const loadedResult = yield* Effect.either(
      Effect.tryPromise({
        try: () => loadVideoInfo(link),
        catch: (e) => toError(e, "Failed to load youtube video info"),
      }),
    );
    const loaded = loadedResult._tag === "Right" ? loadedResult.right : null;
    if (loadedResult._tag === "Left") {
      errors.push(loadedResult.left.message);
    }

    const ffmpegOk = yield* checkFfmpegAvailable;
    if (loaded && ffmpegOk) {
      const adaptive = yield* Effect.either(
        Effect.tryPromise({
          try: () => downloadNativeAdaptive(loaded, path, onProgress),
          catch: (e) => toError(e, "Native high-quality download failed"),
        }),
      );
      if (adaptive._tag === "Right") return;
      errors.push(adaptive.left.message);
      yield* resetDownload(path, onProgress);
    }

    const ytOk = yield* checkYtDlpAvailable;
    if (ytOk) {
      const ytDlp = yield* Effect.either(
        Effect.tryPromise({
          try: () => downloadYtDlpWithProgress(link, path, onProgress),
          catch: (e) => toError(e, "yt-dlp download failed"),
        }),
      );
      if (ytDlp._tag === "Right") return;
      errors.push(ytDlp.left.message);
      yield* resetDownload(path, onProgress);
    }

    if (loaded) {
      const combined = yield* Effect.either(
        Effect.tryPromise({
          try: () => downloadNativeCombined(loaded, path, onProgress),
          catch: (e) => toError(e, "Native download failed"),
        }),
      );
      if (combined._tag === "Right") return;
      errors.push(combined.left.message);
    }

    return yield* Effect.fail(
      new Error(errors.join("; ") || "Failed to download youtube video"),
    );
  });

/**
 * Download a youtube video and save to the provided path.
 * Tries the native InnerTube client first, then falls back to yt-dlp.
 */
export const downloadYoutubeVideo = (
  link: string,
  path: string,
): Effect.Effect<void, Error, never> =>
  downloadWithFallback(link, path, () => undefined);

/**
 * Download with progress updates via callback.
 * Tries the native InnerTube client first, then falls back to yt-dlp.
 */
export const downloadYoutubeVideoWithProgress = (
  link: string,
  path: string,
  onProgress: (p: YoutubeDownloadProgress) => void,
): Effect.Effect<void, Error, never> =>
  downloadWithFallback(link, path, onProgress);
