import { spawn } from "node:child_process";
import { Effect } from "effect";
import ffmpegStatic from "ffmpeg-static";

let ffmpegAvailable: boolean | null = null;
let resolvedFfmpegPath: string | null = null;

const trySpawnVersion = (bin: string): Promise<boolean> =>
  new Promise((resolve) => {
    const child = spawn(bin, ["-version"], {
      stdio: ["ignore", "ignore", "ignore"],
    });
    child.on("error", () => resolve(false));
    child.on("close", (code) => resolve(code === 0));
  });

/**
 * Prefer the npm-bundled binary (ffmpeg-static); fall back to PATH `ffmpeg`.
 */
export const resolveFfmpegPath = async (): Promise<string | null> => {
  if (resolvedFfmpegPath) return resolvedFfmpegPath;

  if (typeof ffmpegStatic === "string" && ffmpegStatic.length > 0) {
    if (await trySpawnVersion(ffmpegStatic)) {
      resolvedFfmpegPath = ffmpegStatic;
      return resolvedFfmpegPath;
    }
  }

  if (await trySpawnVersion("ffmpeg")) {
    resolvedFfmpegPath = "ffmpeg";
    return resolvedFfmpegPath;
  }

  return null;
};

/**
 * Check if ffmpeg is available (bundled or system). Never fails.
 */
export const checkFfmpegAvailable: Effect.Effect<boolean, never, never> =
  Effect.tryPromise({
    try: async () => {
      if (ffmpegAvailable != null) return ffmpegAvailable;
      const path = await resolveFfmpegPath();
      ffmpegAvailable = path != null;
      return ffmpegAvailable;
    },
    catch: (e) => (e instanceof Error ? e : new Error("ffmpeg check failed")),
  }).pipe(Effect.catchAll(() => Effect.succeed(false)));

export const runFfmpeg = (
  args: string[],
): Effect.Effect<{ stdout: string; stderr: string }, Error, never> =>
  Effect.tryPromise({
    try: async () => {
      const bin = await resolveFfmpegPath();
      if (!bin) {
        throw new Error(
          "ffmpeg not available (install failed for ffmpeg-static)",
        );
      }

      return await new Promise<{ stdout: string; stderr: string }>(
        (resolve, reject) => {
          const child = spawn(bin, args, {
            stdio: ["ignore", "pipe", "pipe"],
          });

          let stdout = "";
          let stderr = "";
          child.stdout.setEncoding("utf8");
          child.stderr.setEncoding("utf8");
          child.stdout.on("data", (chunk) => {
            stdout += chunk as string;
          });
          child.stderr.on("data", (chunk) => {
            stderr += chunk as string;
          });
          child.on("error", (err) => reject(err));
          child.on("close", (code) => {
            if (code === 0) resolve({ stdout, stderr });
            else {
              const detail = stderr.trim().split(/\r?\n/).slice(-3).join(" ");
              reject(
                new Error(
                  `ffmpeg failed (code ${code})${detail ? `: ${detail}` : ""}`,
                ),
              );
            }
          });
        },
      );
    },
    catch: (e) => (e instanceof Error ? e : new Error("Failed to run ffmpeg")),
  });

/**
 * Remux H.264 video + AAC audio into a single MP4 without re-encoding.
 */
export const muxVideoAudio = (
  videoPath: string,
  audioPath: string,
  outputPath: string,
): Effect.Effect<void, Error, never> =>
  runFfmpeg([
    "-y",
    "-i",
    videoPath,
    "-i",
    audioPath,
    "-c",
    "copy",
    "-map",
    "0:v:0",
    "-map",
    "1:a:0",
    "-movflags",
    "+faststart",
    outputPath,
  ]).pipe(Effect.asVoid);
