import { readFile, writeFile } from "node:fs/promises";
import { Effect } from "effect";
import { type AppLocaleCode, isAppLocaleCode } from "../i18n/locales.ts";
import { resolveDataFilePath } from "./paths.ts";

export type AppConfig = {
  locale: AppLocaleCode;
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

export const loadConfig: Effect.Effect<AppConfig | null, Error> = Effect.gen(
  function* () {
    const path = yield* resolveDataFilePath(FILE_NAME);
    const data = yield* readJsonFile(path);
    if (
      data &&
      typeof data.locale === "string" &&
      isAppLocaleCode(data.locale)
    ) {
      return { locale: data.locale };
    }
    return null;
  },
);

export const saveConfig = (
  config: AppConfig,
): Effect.Effect<AppConfig, Error> =>
  Effect.gen(function* () {
    const path = yield* resolveDataFilePath(FILE_NAME);
    yield* writeJsonFile(path, config);
    return config;
  });
