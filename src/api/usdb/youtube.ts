import { Effect } from "effect";
import { extractYoutubeVideoId } from "../youtube/videoId.ts";
import { API_URL } from "./config.ts";
import { detectMediaRole, type MediaRole } from "./mediaRole.ts";

export type YoutubeLink = {
  createdAt: Date;
  link: string;
  role: MediaRole;
};

export type VideoMetaResources = {
  video?: string;
  audio?: string;
};

const COMMENT_RE = /<td>\d+\.\d+\.\d+ - \d+:\d+.*?<\/td>[\s\S]*?<\/td>/gm;
const COMMENT_HEADER_RE = /<td>(\d+\.\d+\.\d+) - (\d+:\d+)/;
const ATTR_URL_RE = /(?:src|href)="([^"]+)"/gi;
const PLAIN_YOUTUBE_RE =
  /https?:\/\/(?:www\.)?(?:youtube\.com|youtu\.be)[^\s"'<>]*/gi;

type EmbedHit = {
  id: string;
  index: number;
  length: number;
};

export const parseComments = (html: string): string[] => {
  return [...html.matchAll(COMMENT_RE)].map((m) => m[0]);
};

const parseCommentDate = (dateStr: string, timeStr: string): Date => {
  const [day, month, year] = dateStr.split(".") as [string, string, string];
  const [hour, minute] = timeStr.split(":") as [string, string];
  return new Date(`${month}.${day}.${year} ${hour}:${minute}`);
};

const collectYoutubeEmbeds = (html: string): EmbedHit[] => {
  const hits: EmbedHit[] = [];
  ATTR_URL_RE.lastIndex = 0;
  PLAIN_YOUTUBE_RE.lastIndex = 0;

  for (const match of html.matchAll(ATTR_URL_RE)) {
    const url = match[1];
    if (!url) continue;
    const id = extractYoutubeVideoId(url);
    if (!id) continue;
    hits.push({
      id,
      index: match.index ?? 0,
      length: match[0].length,
    });
  }

  for (const match of html.matchAll(PLAIN_YOUTUBE_RE)) {
    const url = match[0];
    const id = extractYoutubeVideoId(url);
    if (!id) continue;
    hits.push({
      id,
      index: match.index ?? 0,
      length: url.length,
    });
  }

  hits.sort((a, b) => a.index - b.index);

  const unique: EmbedHit[] = [];
  for (const hit of hits) {
    const prev = unique[unique.length - 1];
    if (prev && prev.id === hit.id && hit.index - prev.index < 80) continue;
    unique.push(hit);
  }
  return unique;
};

export const parseYoutubeLinksFromComment = (
  commentHtml: string,
): YoutubeLink[] => {
  const header = commentHtml.match(COMMENT_HEADER_RE);
  const dateStr = header?.[1];
  const timeStr = header?.[2];
  if (!dateStr || !timeStr) return [];

  const createdAt = parseCommentDate(dateStr, timeStr);
  const embeds = collectYoutubeEmbeds(commentHtml);
  if (embeds.length === 0) return [];

  const links: YoutubeLink[] = [];
  let cursor = 0;
  for (const embed of embeds) {
    const prefix = commentHtml.slice(cursor, embed.index);
    let role = detectMediaRole(prefix);
    if (role === "unknown" && embeds.length === 1) {
      role = detectMediaRole(commentHtml);
    }
    links.push({ createdAt, link: embed.id, role });
    cursor = embed.index + embed.length;
  }
  return links;
};

/**
 * @deprecated Use parseYoutubeLinksFromComment. Kept for compatibility.
 */
export const parseYoutubeLinkFromComment = (
  r: RegExpMatchArray | null,
): YoutubeLink | null => {
  if (!r?.[0]) return null;
  return parseYoutubeLinksFromComment(r[0])[0] ?? null;
};

export const parseYoutubeLinks = (html: string): YoutubeLink[] => {
  return parseComments(html).flatMap(parseYoutubeLinksFromComment);
};

export const parseVideoMetaResources = (
  videoHeader?: string,
): VideoMetaResources => {
  if (!videoHeader?.trim()) return {};
  const value = videoHeader.trim();
  const result: VideoMetaResources = {};
  let sawKeyed = false;

  for (const part of value.split(",")) {
    const eq = part.indexOf("=");
    if (eq <= 0) continue;
    const key = part.slice(0, eq).trim().toLowerCase();
    const raw = part.slice(eq + 1).trim();
    if (!raw) continue;
    if (key === "v") {
      result.video = extractYoutubeVideoId(raw) ?? raw;
      sawKeyed = true;
    } else if (key === "a") {
      result.audio = extractYoutubeVideoId(raw) ?? raw;
      sawKeyed = true;
    }
  }

  if (!sawKeyed) {
    const id = extractYoutubeVideoId(value);
    if (id) result.video = id;
  }

  return result;
};

export const normalizeYoutubeLink = (videoLink: string): string =>
  /^(https?:)?\/\//.test(videoLink)
    ? videoLink
    : `https://youtu.be/${videoLink}`;

export const uniqueYoutubeLinks = (links: string[]): string[] => {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const link of links) {
    if (!link) continue;
    const id = extractYoutubeVideoId(link);
    const key = id ?? normalizeYoutubeLink(link);
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(id ?? link);
  }
  return result;
};

export const selectDownloadSources = (
  links: YoutubeLink[],
  meta: VideoMetaResources = {},
): {
  videoLinks: string[];
  audioLinks: string[];
  separateAudio: boolean;
} => {
  const of = (...roles: MediaRole[]) =>
    links.filter((item) => roles.includes(item.role)).map((item) => item.link);

  const idOf = (link: string) => extractYoutubeVideoId(link) ?? link;

  const audioLabeled = uniqueYoutubeLinks([
    ...(meta.audio ? [meta.audio] : []),
    ...of("audio"),
    ...of("both"),
  ]);
  const videoLabeled = uniqueYoutubeLinks([
    ...(meta.video ? [meta.video] : []),
    ...of("video"),
    ...of("both"),
  ]);
  const labeledIds = new Set(
    [...audioLabeled, ...videoLabeled].map((link) => idOf(link)),
  );
  const unlabeled = uniqueYoutubeLinks(of("unknown")).filter(
    (link) => !labeledIds.has(idOf(link)),
  );

  const hasAudioLabel = audioLabeled.length > 0;
  const hasVideoLabel = videoLabeled.length > 0;

  let videoLinks: string[];
  let audioLinks: string[];

  if (hasAudioLabel && hasVideoLabel) {
    videoLinks = uniqueYoutubeLinks([
      ...videoLabeled,
      ...unlabeled,
      ...audioLabeled,
    ]);
    audioLinks = uniqueYoutubeLinks([
      ...audioLabeled,
      ...unlabeled,
      ...videoLabeled,
    ]);
  } else if (hasAudioLabel) {
    if (unlabeled.length > 0) {
      videoLinks = uniqueYoutubeLinks([...unlabeled, ...audioLabeled]);
      audioLinks = uniqueYoutubeLinks([...audioLabeled, ...unlabeled]);
    } else {
      videoLinks = audioLabeled;
      audioLinks = audioLabeled;
    }
  } else if (hasVideoLabel) {
    if (unlabeled.length > 0) {
      videoLinks = uniqueYoutubeLinks([...videoLabeled, ...unlabeled]);
      audioLinks = uniqueYoutubeLinks([...unlabeled, ...videoLabeled]);
    } else {
      videoLinks = videoLabeled;
      audioLinks = videoLabeled;
    }
  } else {
    videoLinks = unlabeled;
    audioLinks = unlabeled;
  }

  const videoId = extractYoutubeVideoId(videoLinks[0] ?? "");
  const audioId = extractYoutubeVideoId(audioLinks[0] ?? "");
  const separateAudio = Boolean(videoId && audioId && videoId !== audioId);

  return { videoLinks, audioLinks, separateAudio };
};

export const fetchDetailPage = (id: number, cookie?: string) =>
  Effect.tryPromise({
    try: async () => {
      const response = await fetch(`${API_URL}/?link=detail&id=${id}`, {
        method: "GET",
        headers: {
          ...(cookie ? { Cookie: cookie } : {}),
        },
      });
      if (!response.ok) {
        throw new Error(
          `Detail request failed: ${response.status} ${response.statusText}`,
        );
      }
      return await response.text();
    },
    catch: (e) =>
      e instanceof Error ? e : new Error("Failed to fetch detail page"),
  });

export const getYoutubeLinksById = (id: number, cookie?: string) =>
  Effect.gen(function* () {
    const html = yield* fetchDetailPage(id, cookie);
    return parseYoutubeLinks(html);
  });
