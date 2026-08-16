import i18n from "i18next";
import {
  type AppLocaleCode,
  DEFAULT_LOCALE,
  isAppLocaleCode,
} from "./locales.ts";
import { enGB } from "./translations/en-GB.ts";
import { enUS } from "./translations/en-US.ts";
import { esAR } from "./translations/es-AR.ts";
import { esES } from "./translations/es-ES.ts";
import { jaJP } from "./translations/ja-JP.ts";
import { plPL } from "./translations/pl-PL.ts";
import { ptBR } from "./translations/pt-BR.ts";
import { ptPT } from "./translations/pt-PT.ts";
import { ruRU } from "./translations/ru-RU.ts";
import { zhCN } from "./translations/zh-CN.ts";

const resources = {
  "en-US": { translation: enUS },
  "en-GB": { translation: enGB },
  "es-ES": { translation: esES },
  "es-AR": { translation: esAR },
  "pt-BR": { translation: ptBR },
  "pt-PT": { translation: ptPT },
  "pl-PL": { translation: plPL },
  "ja-JP": { translation: jaJP },
  "zh-CN": { translation: zhCN },
  "ru-RU": { translation: ruRU },
} as const;

let initialized = false;

export const initI18n = async (
  locale: AppLocaleCode = DEFAULT_LOCALE,
): Promise<typeof i18n> => {
  if (!initialized) {
    await i18n.init({
      resources,
      lng: locale,
      fallbackLng: DEFAULT_LOCALE,
      interpolation: { escapeValue: false },
      returnNull: false,
    });
    initialized = true;
  } else if (i18n.language !== locale) {
    await i18n.changeLanguage(locale);
  }
  return i18n;
};

export const changeAppLocale = async (locale: AppLocaleCode): Promise<void> => {
  await initI18n(locale);
  await i18n.changeLanguage(locale);
};

export const getCurrentLocale = (): AppLocaleCode => {
  const lng = i18n.language ?? DEFAULT_LOCALE;
  return isAppLocaleCode(lng) ? lng : DEFAULT_LOCALE;
};

export { i18n };
export type { AppLocaleCode };
