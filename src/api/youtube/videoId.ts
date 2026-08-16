const YOUTUBE_ID_RE = /^[a-zA-Z0-9_-]{11}$/;

/**
 * Extract a YouTube video ID from a watch URL, short URL, embed URL, or raw ID.
 */
export const extractYoutubeVideoId = (link: string): string | null => {
  const trimmed = link.trim();
  if (YOUTUBE_ID_RE.test(trimmed)) return trimmed;

  const withProtocol = /^(https?:)?\/\//i.test(trimmed)
    ? trimmed.startsWith("//")
      ? `https:${trimmed}`
      : trimmed
    : `https://${trimmed}`;

  try {
    const url = new URL(withProtocol);
    const host = url.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = url.pathname.split("/").filter(Boolean)[0];
      return id && YOUTUBE_ID_RE.test(id) ? id : null;
    }

    if (
      host === "youtube.com" ||
      host === "m.youtube.com" ||
      host === "music.youtube.com" ||
      host === "youtube-nocookie.com"
    ) {
      const fromQuery = url.searchParams.get("v");
      if (fromQuery && YOUTUBE_ID_RE.test(fromQuery)) return fromQuery;

      const parts = url.pathname.split("/").filter(Boolean);
      const prefixed = ["embed", "shorts", "v", "live"];
      const prefixIndex = parts.findIndex((part) => prefixed.includes(part));
      if (prefixIndex >= 0) {
        const id = parts[prefixIndex + 1];
        if (id && YOUTUBE_ID_RE.test(id)) return id;
      }
    }
  } catch {
    return null;
  }

  return null;
};
