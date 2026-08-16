/**
 * Common language values used in USDB song metadata / search filter.
 * Values match the lowercase tags shown in search results.
 */
export const USDB_LANGUAGES = [
  "arabic",
  "catalan",
  "chinese",
  "croatian",
  "czech",
  "danish",
  "dutch",
  "english",
  "finnish",
  "french",
  "german",
  "greek",
  "hebrew",
  "hindi",
  "hungarian",
  "icelandic",
  "indonesian",
  "instrumental",
  "italian",
  "japanese",
  "japanese (romanized)",
  "korean",
  "korean (romanized)",
  "latin",
  "norwegian",
  "polish",
  "portuguese",
  "portuguese (brazil)",
  "romanian",
  "russian",
  "serbian",
  "slovak",
  "slovenian",
  "spanish",
  "swedish",
  "thai",
  "turkish",
  "ukrainian",
  "vietnamese",
] as const;

export type UsdbLanguage = (typeof USDB_LANGUAGES)[number];

export const formatLanguageLabel = (language: string): string => {
  if (!language) return "Any";
  return language
    .split(" ")
    .map((part) => {
      if (part.startsWith("(") && part.endsWith(")")) {
        const inner = part.slice(1, -1);
        return `(${inner.charAt(0).toUpperCase()}${inner.slice(1)})`;
      }
      return `${part.charAt(0).toUpperCase()}${part.slice(1)}`;
    })
    .join(" ");
};
