export type MediaRole = "video" | "audio" | "both" | "unknown";

const VIDEO_PHRASES = [
  "official music video",
  "official video",
  "lyric video",
  "lyrics video",
  "background video",
  "video oficial",
  "video official",
  "clipe de video",
  "clipe oficial",
  "video clip",
  "music video",
  "clip video",
  "videoclipe",
  "videoclip",
  "visualizacao",
  "visualizacion",
  "hintergrund",
  "bg video",
  "video",
  "clip",
  "clipe",
  "klip",
  "wideo",
  "visuals",
  "visual",
  "visuel",
  "visivo",
  "filme",
  "film",
  "pelicula",
  "movie",
  "ビデオクリップ",
  "ビデオ",
  "クリップ",
  "映像",
  "视频",
  "影片",
  "視頻",
  "비디오",
  "영상",
  "видео",
  "клип",
  "mv",
];

const AUDIO_PHRASES = [
  "official audio",
  "audio official",
  "audio oficial",
  "audio only",
  "audio clip",
  "sound clip",
  "sound track",
  "soundtrack",
  "backing track",
  "fonte de audio",
  "fonte do audio",
  "fuente de audio",
  "audio source",
  "sound source",
  "audio",
  "sound",
  "som",
  "sonido",
  "suono",
  "mp3",
  "musica",
  "musik",
  "musique",
  "muzyka",
  "music",
  "klang",
  "geluid",
  "ljud",
  "dzwiek",
  "zvuk",
  "hudba",
  "hang",
  "zene",
  "ses",
  "son",
  "ton",
  "オーディオ",
  "音声",
  "音源",
  "音频",
  "音訊",
  "声音",
  "聲音",
  "오디오",
  "소리",
  "음원",
  "аудио",
  "звук",
  "музыка",
];

type PhraseHit = {
  role: "video" | "audio";
  index: number;
  length: number;
};

const PHRASES: Array<{ phrase: string; role: "video" | "audio" }> = [
  ...VIDEO_PHRASES.map((phrase) => ({ phrase, role: "video" as const })),
  ...AUDIO_PHRASES.map((phrase) => ({ phrase, role: "audio" as const })),
].sort(
  (a, b) =>
    b.phrase.length - a.phrase.length || a.phrase.localeCompare(b.phrase),
);

const WORD_CHAR_RE = /[\p{L}\p{N}_]/u;
const CJK_RE = /[\u3040-\u30ff\u4e00-\u9fff\uac00-\ud7af]/;
const CORE_CHAR_RE =
  /[^a-z0-9\u0400-\u04ff\u3040-\u30ff\u4e00-\u9fff\uac00-\ud7af]+/g;

export const foldText = (value: string): string =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .normalize("NFC");

export const stripHtml = (html: string): string =>
  html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(?:p|div|tr|li|h[1-6])>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/[ \t]{2,}/g, " ");

const isWordChar = (char: string | undefined): boolean =>
  char != null && WORD_CHAR_RE.test(char);

const isWordBoundary = (
  text: string,
  index: number,
  length: number,
): boolean => {
  const phrase = text.slice(index, index + length);
  if (CJK_RE.test(phrase)) return true;
  return !isWordChar(text[index - 1]) && !isWordChar(text[index + length]);
};

const lineAround = (
  text: string,
  index: number,
): { line: string; start: number; end: number } => {
  const start = text.lastIndexOf("\n", index - 1) + 1;
  const nl = text.indexOf("\n", index);
  const end = nl < 0 ? text.length : nl;
  return { line: text.slice(start, end).trim(), start, end };
};

const isLabelContext = (
  text: string,
  index: number,
  length: number,
): boolean => {
  const after = text.slice(index + length);
  const before = text.slice(0, index);
  const prev = before.trimEnd().slice(-1);
  const next = after.trimStart()[0];

  if ((prev === "[" && next === "]") || (prev === "(" && next === ")")) {
    return true;
  }

  if (/^\s*[:：\-–—|/]/.test(after)) return true;

  const { line } = lineAround(text, index);
  const lineCore = line.replace(CORE_CHAR_RE, "");
  if (lineCore.length > 0 && lineCore.length <= 32) return true;

  const textBefore = before.replace(CORE_CHAR_RE, "");
  return textBefore.length === 0;
};

const sameLine = (text: string, a: number, b: number): boolean => {
  const lineA = lineAround(text, a);
  return b >= lineA.start && b < lineA.end;
};

const hasJoinerBetween = (
  text: string,
  a: PhraseHit,
  b: PhraseHit,
): boolean => {
  const left = a.index < b.index ? a : b;
  const right = a.index < b.index ? b : a;
  const mid = text.slice(left.index + left.length, right.index);
  const compact = mid.replace(/\s+/g, " ").trim();
  if (compact.length === 0) return true;
  return /^(?:[&+/|,]|and|und|et|e|y)$/i.test(compact);
};

export const detectMediaRole = (htmlOrText: string): MediaRole => {
  const folded = foldText(stripHtml(htmlOrText));
  if (!folded.trim()) return "unknown";

  const used = new Array<boolean>(folded.length).fill(false);
  const hits: PhraseHit[] = [];

  for (const { phrase, role } of PHRASES) {
    let from = 0;
    while (from <= folded.length - phrase.length) {
      const index = folded.indexOf(phrase, from);
      if (index < 0) break;
      from = index + 1;

      let overlap = false;
      for (let i = 0; i < phrase.length; i++) {
        if (used[index + i]) {
          overlap = true;
          break;
        }
      }
      if (overlap) continue;
      if (!isWordBoundary(folded, index, phrase.length)) continue;
      if (!isLabelContext(folded, index, phrase.length)) continue;

      for (let i = 0; i < phrase.length; i++) used[index + i] = true;
      hits.push({ role, index, length: phrase.length });
    }
  }

  if (hits.length === 0) return "unknown";
  hits.sort((a, b) => a.index - b.index);

  const lastVideo = [...hits].reverse().find((h) => h.role === "video");
  const lastAudio = [...hits].reverse().find((h) => h.role === "audio");

  if (lastVideo && lastAudio) {
    if (
      sameLine(folded, lastVideo.index, lastAudio.index) &&
      hasJoinerBetween(folded, lastVideo, lastAudio)
    ) {
      return "both";
    }
    return lastVideo.index > lastAudio.index ? "video" : "audio";
  }

  return lastVideo ? "video" : "audio";
};
