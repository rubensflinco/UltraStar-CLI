import type { TranslationSchema } from "./en-US.ts";

export const enGB: TranslationSchema = {
  app: {
    title: "UltraStar CLI",
  },
  status: {
    login: "Login:",
    loggedIn: "Logged in",
    checking: "Checking…",
    notLoggedIn: "Not logged in",
    loginError: "An unknown error occurred. Please report on GitHub.",
    download: "Download:",
    native: "Native",
    ytDlpFallback: " · yt-dlp fallback: ",
    available: "Available",
    notInstalled: "Not installed",
  },
  loading: {
    initializing: "Initialising session...",
    searching: "Searching...",
  },
  form: {
    artist: "Artist:",
    title: "Title:",
    language: "Language:",
    settings: "Settings",
    artistPlaceholder: "e.g. Queen",
    titlePlaceholder: "e.g. Bohemian Rhapsody",
    enterToSelect: "(Enter to select)",
    pressEnterSearch: "Press Enter to search",
    pressEnterLanguage: "Press Enter to select language",
    pressEnterSettings: "Press Enter to open settings",
  },
  language: {
    any: "Any",
    selectSongLanguage: "Select song language",
    selectAppLanguage: "Select your preferred language",
  },
  results: {
    noResults: "No results.",
    page: "Page",
    of: "of",
    language: "Language:",
    navigatePages: "Use ←/→ to navigate pages",
  },
  downloaded: {
    recentlyDownloaded: "Recently downloaded",
  },
  settings: {
    title: "Settings",
    appLanguage: "App language:",
    changeHint: "Press Enter to change language",
    backHint: "Press Esc to go back",
  },
  localeSetup: {
    title: "Welcome to UltraStar CLI",
    subtitle: "Choose the language you want to use:",
  },
  help: {
    tips: "Tips:",
    form: "Tab: switch field • Enter: search / select • Esc: quit",
    language: "↑/↓: select • Enter: confirm • Esc: cancel",
    localeSetup: "↑/↓: select • Enter: confirm",
    settings: "Enter: change language • Esc: back",
    results:
      "↑/↓: select • Enter: download • ←/→: page • e: edit search • l: language • r: refresh • Esc: back",
    resultsNoDownload:
      "↑/↓: select • ←/→: page • e: edit search • l: language • r: refresh • Esc: back",
  },
  error: {
    label: "Error:",
  },
};
