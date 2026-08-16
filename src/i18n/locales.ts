/**
 * App UI locales and their mapping to USDB song-language filters.
 */
export const APP_LOCALES = [
  {
    code: "en-US",
    label: "English (United States)",
    nativeLabel: "English (US)",
    usdbLanguage: "english",
  },
  {
    code: "en-GB",
    label: "English (United Kingdom)",
    nativeLabel: "English (UK)",
    usdbLanguage: "english",
  },
  {
    code: "es-ES",
    label: "Spanish (Spain)",
    nativeLabel: "Español (España)",
    usdbLanguage: "spanish",
  },
  {
    code: "es-AR",
    label: "Spanish (Argentina)",
    nativeLabel: "Español (Argentina)",
    usdbLanguage: "spanish",
  },
  {
    code: "pt-BR",
    label: "Portuguese (Brazil)",
    nativeLabel: "Português (Brasil)",
    usdbLanguage: "portuguese (brazil)",
  },
  {
    code: "pt-PT",
    label: "Portuguese (Portugal)",
    nativeLabel: "Português (Portugal)",
    usdbLanguage: "portuguese",
  },
  {
    code: "pl-PL",
    label: "Polish",
    nativeLabel: "Polski",
    usdbLanguage: "polish",
  },
  {
    code: "ja-JP",
    label: "Japanese",
    nativeLabel: "日本語",
    usdbLanguage: "japanese",
  },
  {
    code: "zh-CN",
    label: "Chinese (Simplified)",
    nativeLabel: "中文",
    usdbLanguage: "chinese",
  },
  {
    code: "ru-RU",
    label: "Russian",
    nativeLabel: "Русский",
    usdbLanguage: "russian",
  },
] as const;

export type AppLocaleCode = (typeof APP_LOCALES)[number]["code"];

export const DEFAULT_LOCALE: AppLocaleCode = "en-US";

export const isAppLocaleCode = (value: string): value is AppLocaleCode =>
  APP_LOCALES.some((locale) => locale.code === value);

export const getLocaleMeta = (code: AppLocaleCode) =>
  APP_LOCALES.find((locale) => locale.code === code) ?? APP_LOCALES[0];

export const getUsdbLanguageForLocale = (code: AppLocaleCode): string =>
  getLocaleMeta(code).usdbLanguage;
