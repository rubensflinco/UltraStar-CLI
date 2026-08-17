import { Effect } from "effect";
import { render } from "ink";
import { DEFAULT_TARGET_PEAK_DB } from "./api/audio/normalize.ts";
import { initI18n } from "./i18n/index.ts";
import { I18nProvider } from "./i18n/I18nProvider.tsx";
import { DEFAULT_LOCALE } from "./i18n/locales.ts";
import { loadConfig } from "./storage/config.ts";
import App from "./ui/App.tsx";

const ENTER_ALTERNATE_SCREEN = "\u001b[?1049h";
const LEAVE_ALTERNATE_SCREEN = "\u001b[?1049l";
const CLEAR_SCREEN = "\u001b[2J";
const CURSOR_HOME = "\u001b[H";

process.stdout.write(ENTER_ALTERNATE_SCREEN + CLEAR_SCREEN + CURSOR_HOME);

const config = await Effect.runPromise(loadConfig);
const initialLocale = config?.locale ?? null;
const initialTargetPeakDb =
  config?.targetPeakDb ?? DEFAULT_TARGET_PEAK_DB;
await initI18n(initialLocale ?? DEFAULT_LOCALE);

const instance = render(
  <I18nProvider initialLocale={initialLocale ?? DEFAULT_LOCALE}>
    <App
      initialLocale={initialLocale}
      initialTargetPeakDb={initialTargetPeakDb}
    />
  </I18nProvider>,
);

instance.waitUntilExit().finally(() => {
  try {
    process.stdout.write(LEAVE_ALTERNATE_SCREEN);
  } catch {}
});
