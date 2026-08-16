import { spawn } from "node:child_process";
import { Effect } from "effect";

let ffmpegAvailable: boolean | null = null;

/**
 * Check if ffmpeg is available by running `ffmpeg -version`.
 * Succeeds with true when exit code is 0; otherwise false. Never fails.
 */
export const checkFfmpegAvailable: Effect.Effect<boolean, never, never> =
  Effect.tryPromise({
    try: async () => {
      if (ffmpegAvailable != null) return ffmpegAvailable;
      const ok = await new Promise<boolean>((resolve) => {
        const child = spawn("ffmpeg", ["-version"], {
          stdio: ["ignore", "ignore", "ignore"],
        });
        child.on("error", () => resolve(false));
        child.on("close", (code) => resolve(code === 0));
      });
      ffmpegAvailable = ok;
      return ok;
    },
    catch: (e) => (e instanceof Error ? e : new Error("ffmpeg check failed")),
  }).pipe(Effect.catchAll(() => Effect.succeed(false)));

/**
 * Remux H.264 video + AAC audio into a single MP4 without re-encoding.
 */
export const muxVideoAudio = (
  videoPath: string,
  audioPath: string,
  outputPath: string,
): Effect.Effect<void, Error, never> =>
  Effect.tryPromise({
    try: async () => {
      await new Promise<void>((resolve, reject) => {
        const child = spawn(
          "ffmpeg",
          [
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
          ],
          { stdio: ["ignore", "ignore", "pipe"] },
        );

        let stderr = "";
        child.stderr.setEncoding("utf8");
        child.stderr.on("data", (chunk) => {
          stderr += chunk as string;
        });
        child.on("error", (err) => reject(err));
        child.on("close", (code) => {
          if (code === 0) resolve();
          else {
            const detail = stderr.trim().split(/\r?\n/).slice(-3).join(" ");
            reject(
              new Error(
                `ffmpeg mux failed (code ${code})${detail ? `: ${detail}` : ""}`,
              ),
            );
          }
        });
      });
    },
    catch: (e) => (e instanceof Error ? e : new Error("Failed to mux video")),
  });
