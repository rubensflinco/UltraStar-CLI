import {
  createContext,
  createElement,
  type FC,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { changeAppLocale, getCurrentLocale, i18n } from "./index.ts";
import type { AppLocaleCode } from "./locales.ts";

type I18nContextValue = {
  locale: AppLocaleCode;
  t: (key: string, options?: Record<string, unknown>) => string;
  setLocale: (locale: AppLocaleCode) => Promise<void>;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export type I18nProviderProps = {
  initialLocale: AppLocaleCode;
  children: ReactNode;
};

export const I18nProvider: FC<I18nProviderProps> = ({
  initialLocale,
  children,
}) => {
  const [locale, setLocaleState] = useState<AppLocaleCode>(initialLocale);

  const setLocale = useCallback(async (next: AppLocaleCode) => {
    await changeAppLocale(next);
    setLocaleState(getCurrentLocale());
  }, []);

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      t: (key: string, options?: Record<string, unknown>) =>
        i18n.t(key, options),
      setLocale,
    }),
    [locale, setLocale],
  );

  return createElement(I18nContext.Provider, { value }, children);
};

export const useI18n = (): I18nContextValue => {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return ctx;
};
