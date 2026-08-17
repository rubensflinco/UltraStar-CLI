import { readFile, writeFile } from "node:fs/promises";
import { Effect } from "effect";
import { DEFAULT_TARGET_PEAK_DB } from "../api/audio/normalize.ts";
import { type AppLocaleCode, isAppLocaleCode } from "../i18n/locales.ts";
import { resolveDataFilePath } from "./paths.ts";

export const MIN_TARGET_PEAK_DB = -24;
export const MAX_TARGET_PEAK_DB = 0;

export type AppConfig = {
  locale?: AppLocaleCode;
  targetPeakDb: number;
};

export type AppConfigPatch = {
  locale?: AppLocaleCode;
  targetPeakDb?: number;
};

const FILE_NAME = "config.json";

const readJsonFile = (
  path: string,
): Effect.Effect<Record<string, unknown> | null, Error> =>
  Effect.catchAll(
    Effect.tryPromise({
      try: async () =>
        JSON.parse(await readFile(path, "utf8")) as Record<string, unknown>,
      catch: (e) =>
        e instanceof Error ? e : new Error("Failed to read config"),
    }),
    () => Effect.succeed(null),
  );

const writeJsonFile = (
  path: string,
  data: unknown,
): Effect.Effect<true, Error> =>
  Effect.tryPromise({
    try: async () => {
      await writeFile(path, JSON.stringify(data, null, 2), "utf8");
      return true as const;
    },
    catch: (e) =>
      e instanceof Error ? e : new Error("Failed to write config"),
  });

export const clampTargetPeakDb = (value: number): number =>
  Math.max(MIN_TARGET_PEAK_DB, Math.min(MAX_TARGET_PEAK_DB, value));

export const parseTargetPeakDb = (value: unknown): number => {
  const n =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number.parseFloat(value.replace(",", "."))
        : Number.NaN;
  if (!Number.isFinite(n)) return DEFAULT_TARGET_PEAK_DB;
  return clampTargetPeakDb(n);
};

const parseLocale = (value: unknown): AppLocaleCode | undefined =>
  typeof value === "string" && isAppLocaleCode(value) ? value : undefined;

const fromRaw = (data: Record<string, unknown> | null): AppConfig => ({
  locale: parseLocale(data?.locale),
  targetPeakDb: parseTargetPeakDb(data?.targetPeakDb),
});

export const loadConfig: Effect.Effect<AppConfig | null, Error> = Effect.gen(
  function* () {
    const path = yield* resolveDataFilePath(FILE_NAME);
    const data = yield* readJsonFile(path);
    if (!data) return null;
    return fromRaw(data);
  },
);

export const saveConfig = (
  patch: AppConfigPatch,
): Effect.Effect<AppConfig, Error> =>
  Effect.gen(function* () {
    const path = yield* resolveDataFilePath(FILE_NAME);
    const existing = fromRaw(yield* readJsonFile(path));
    const next: AppConfig = {
      locale: patch.locale ?? existing.locale,
      targetPeakDb:
        patch.targetPeakDb !== undefined
          ? clampTargetPeakDb(patch.targetPeakDb)
          : existing.targetPeakDb,
    };
    const toWrite: Record<string, unknown> = {
      targetPeakDb: next.targetPeakDb,
    };
    if (next.locale) toWrite.locale = next.locale;
    yield* writeJsonFile(path, toWrite);
    return next;
  });
