import { access, readdir } from "node:fs/promises";
import { join } from "node:path";
import { Effect } from "effect";
import {
  normalizeSongDirectory,
  type NormalizeSongResult,
  VIDEO_FILENAME,
} from "../api/audio/normalize.ts";

export type BatchNormalizeProgress = {
  current: number;
  total: number;
  dirName: string;
  percent: number;
};

export type BatchNormalizeResult = {
  processed: NormalizeSongResult[];
  succeeded: number;
  skipped: number;
  failed: number;
};

const fileExists = async (path: string): Promise<boolean> => {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
};

/**
 * List song folders under baseDir that contain video.mp4.
 */
export const listSongDirsWithVideo = (
  baseDir: string,
): Effect.Effect<Array<{ songDir: string; dirName: string }>, Error, never> =>
  Effect.tryPromise({
    try: async () => {
      const entries = await readdir(baseDir, { withFileTypes: true });
      const dirs = entries.filter((e) => e.isDirectory()).map((e) => e.name);
      const result: Array<{ songDir: string; dirName: string }> = [];
      for (const dirName of dirs) {
        const songDir = join(baseDir, dirName);
        if (await fileExists(join(songDir, VIDEO_FILENAME))) {
          result.push({ songDir, dirName });
        }
      }
      result.sort((a, b) => a.dirName.localeCompare(b.dirName));
      return result;
    },
    catch: (e) =>
      e instanceof Error
        ? e
        : new Error("Failed to list song directories"),
  });

/**
 * Run volume balancing on every song folder that has video.mp4.
 */
export const normalizeAllSongs = (
  baseDir: string,
  onProgress?: (p: BatchNormalizeProgress) => void,
  targetPeakDb?: number,
): Effect.Effect<BatchNormalizeResult, Error, never> =>
  Effect.gen(function* () {
    const songs = yield* listSongDirsWithVideo(baseDir);
    const processed: NormalizeSongResult[] = [];
    let succeeded = 0;
    let skipped = 0;
    let failed = 0;

    for (let i = 0; i < songs.length; i++) {
      const { songDir, dirName } = songs[i]!;
      onProgress?.({
        current: i + 1,
        total: songs.length,
        dirName,
        percent: songs.length === 0 ? 1 : i / songs.length,
      });

      const result = yield* Effect.either(
        normalizeSongDirectory(songDir, dirName, targetPeakDb),
      );

      if (result._tag === "Left") {
        failed += 1;
        processed.push({
          songDir,
          dirName,
          peakBeforeDb: null,
          gainDb: 0,
          skipped: true,
          reason: result.left.message,
        });
        continue;
      }

      processed.push(result.right);
      if (result.right.skipped) skipped += 1;
      else succeeded += 1;
    }

    onProgress?.({
      current: songs.length,
      total: songs.length,
      dirName: "",
      percent: 1,
    });

    return { processed, succeeded, skipped, failed } satisfies BatchNormalizeResult;
  });
