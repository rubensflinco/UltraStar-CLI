import { access, readFile, rename, unlink, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { Effect } from "effect";
import { runFfmpeg } from "../youtube/ffmpeg.ts";

/** Default peak target near the yellow zone on typical DAW meters (−12…−3 dB). */
export const DEFAULT_TARGET_PEAK_DB = -3;
export const TARGET_PEAK_DB = DEFAULT_TARGET_PEAK_DB;

export const VIDEO_FILENAME = "video.mp4";
export const AUDIO_FILENAME = "audio.mp3";
export const SONG_TXT_FILENAME = "song.txt";

export type NormalizeSongResult = {
  songDir: string;
  dirName: string;
  peakBeforeDb: number | null;
  gainDb: number;
  skipped: boolean;
  reason?: string;
};

const fileExists = async (path: string): Promise<boolean> => {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
};

const parseMaxVolumeDb = (stderr: string): number | null => {
  const match = stderr.match(/max_volume:\s*(-?[\d.]+)\s*dB/i);
  if (!match?.[1]) return null;
  const value = Number.parseFloat(match[1]);
  return Number.isFinite(value) ? value : null;
};

/**
 * Measure peak volume of a media file via ffmpeg volumedetect.
 */
export const detectMaxVolumeDb = (
  inputPath: string,
): Effect.Effect<number | null, Error, never> =>
  Effect.gen(function* () {
    const { stderr } = yield* runFfmpeg([
      "-i",
      inputPath,
      "-af",
      "volumedetect",
      "-f",
      "null",
      "-",
    ]);
    return parseMaxVolumeDb(stderr);
  });

/**
 * Extract audio from video (or any media) and peak-normalize to targetPeakDb.
 * Leaves the source video untouched.
 */
export const extractNormalizedMp3 = (
  inputPath: string,
  outputMp3Path: string,
  targetPeakDb: number = DEFAULT_TARGET_PEAK_DB,
): Effect.Effect<
  { peakBeforeDb: number | null; gainDb: number },
  Error,
  never
> =>
  Effect.gen(function* () {
    const peakBeforeDb = yield* detectMaxVolumeDb(inputPath);
    const gainDb =
      peakBeforeDb == null
        ? 0
        : Math.max(-60, Math.min(60, targetPeakDb - peakBeforeDb));

    const tmpPath = `${outputMp3Path}.tmp.mp3`;
    const volumeFilter =
      Math.abs(gainDb) < 0.05 ? "anull" : `volume=${gainDb.toFixed(2)}dB`;

    const encode = yield* Effect.either(
      runFfmpeg([
        "-y",
        "-i",
        inputPath,
        "-vn",
        "-af",
        volumeFilter,
        "-acodec",
        "libmp3lame",
        "-b:a",
        "192k",
        "-ar",
        "44100",
        "-ac",
        "2",
        tmpPath,
      ]),
    );

    if (encode._tag === "Left") {
      yield* Effect.promise(() => unlink(tmpPath).catch(() => undefined));
      return yield* Effect.fail(encode.left);
    }

    const moved = yield* Effect.either(
      Effect.tryPromise({
        try: async () => {
          await rename(tmpPath, outputMp3Path);
        },
        catch: (e) =>
          e instanceof Error ? e : new Error("Failed to write audio.mp3"),
      }),
    );

    if (moved._tag === "Left") {
      yield* Effect.promise(() => unlink(tmpPath).catch(() => undefined));
      return yield* Effect.fail(moved.left);
    }

    return { peakBeforeDb, gainDb };
  });

/**
 * Ensure song.txt points UltraStar at audio.mp3 + video.mp4.
 * Creates a minimal header file if song.txt is missing.
 */
export const updateSongTxtMediaTags = (
  songDir: string,
): Effect.Effect<void, Error, never> =>
  Effect.tryPromise({
    try: async () => {
      const songTxtPath = join(songDir, SONG_TXT_FILENAME);
      let content = "";
      if (await fileExists(songTxtPath)) {
        content = await readFile(songTxtPath, "utf8");
      }

      const lines = content.length > 0 ? content.split(/\r?\n/) : [];
      const body: string[] = [];
      let hasMp3 = false;
      let hasVideo = false;
      const headerOut: string[] = [];

      for (const line of lines) {
        if (!line.startsWith("#")) {
          body.push(line);
          continue;
        }
        const colon = line.indexOf(":");
        if (colon <= 1) {
          headerOut.push(line);
          continue;
        }
        const key = line.slice(1, colon).toUpperCase();
        if (key === "MP3") {
          headerOut.push(`#MP3:${AUDIO_FILENAME}`);
          hasMp3 = true;
          continue;
        }
        if (key === "VIDEO") {
          headerOut.push(`#VIDEO:${VIDEO_FILENAME}`);
          hasVideo = true;
          continue;
        }
        headerOut.push(line);
      }

      if (!hasMp3) headerOut.unshift(`#MP3:${AUDIO_FILENAME}`);
      if (!hasVideo) {
        const mp3Idx = headerOut.findIndex((l) =>
          l.toUpperCase().startsWith("#MP3:"),
        );
        headerOut.splice(mp3Idx + 1, 0, `#VIDEO:${VIDEO_FILENAME}`);
      }

      const next = `${[...headerOut, ...body].join("\n").replace(/\n+$/, "")}\n`;
      await writeFile(songTxtPath, next, "utf8");
    },
    catch: (e) =>
      e instanceof Error ? e : new Error("Failed to update song.txt"),
  });

/**
 * Normalize one song folder: source media → audio.mp3 (balanced), update song.txt.
 * By default extracts from video.mp4. Pass audioSourcePath to use a different file
 * (e.g. a YouTube source labeled AUDIO) while leaving the clip video untouched.
 */
export const normalizeSongDirectory = (
  songDir: string,
  dirName?: string,
  targetPeakDb: number = DEFAULT_TARGET_PEAK_DB,
  audioSourcePath?: string,
): Effect.Effect<NormalizeSongResult, Error, never> =>
  Effect.gen(function* () {
    const name =
      dirName ?? songDir.split(/[/\\]/).filter(Boolean).at(-1) ?? songDir;
    const videoPath = join(songDir, VIDEO_FILENAME);
    const audioPath = join(songDir, AUDIO_FILENAME);
    const sourcePath = audioSourcePath ?? videoPath;

    const hasSource = yield* Effect.promise(() => fileExists(sourcePath));

    if (!hasSource) {
      return {
        songDir,
        dirName: name,
        peakBeforeDb: null,
        gainDb: 0,
        skipped: true,
        reason: audioSourcePath ? "missing audio source" : "missing video.mp4",
      } satisfies NormalizeSongResult;
    }

    const { peakBeforeDb, gainDb } = yield* extractNormalizedMp3(
      sourcePath,
      audioPath,
      targetPeakDb,
    );
    yield* updateSongTxtMediaTags(songDir);

    return {
      songDir,
      dirName: name,
      peakBeforeDb,
      gainDb,
      skipped: false,
    } satisfies NormalizeSongResult;
  });
