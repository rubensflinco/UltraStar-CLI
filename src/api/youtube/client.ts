import { Innertube, Platform } from "youtubei.js";

export const YOUTUBE_DOWNLOAD_CLIENTS = [
  "MWEB",
  "ANDROID",
  "IOS",
  "TV",
  "WEB",
] as const;

export type YoutubeDownloadClient = (typeof YOUTUBE_DOWNLOAD_CLIENTS)[number];

// youtubei.js needs a JS evaluator to decipher streaming URLs.
Platform.shim.eval = (data) => new Function(data.output)();

let innertubePromise: Promise<Innertube> | null = null;

/**
 * Shared InnerTube session. Reusing one client avoids spawning a new
 * YouTube player/session for every concurrent download.
 */
export const getInnertube = (): Promise<Innertube> => {
  if (!innertubePromise) {
    innertubePromise = Innertube.create({
      generate_session_locally: true,
    }).catch((error: unknown) => {
      innertubePromise = null;
      throw error;
    });
  }
  return innertubePromise;
};

export const warmupInnertube = (): Promise<void> =>
  getInnertube().then(
    () => undefined,
    () => undefined,
  );
