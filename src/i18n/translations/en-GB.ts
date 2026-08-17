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
    normalizeVolumes: "Balance volumes",
    settings: "Settings",
    artistPlaceholder: "e.g. Queen",
    titlePlaceholder: "e.g. Bohemian Rhapsody",
    enterToSelect: "(Enter to select)",
    pressEnterSearch: "Press Enter to search",
    pressEnterLanguage: "Press Enter to select language",
    pressEnterNormalize: "Press Enter to balance all song volumes",
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
    targetPeakDb: "Target peak:",
    targetPeakDbPlaceholder: "e.g. -3",
    targetPeakDbHint:
      "Peak volume target in dB ({{min}} to {{max}}). Default is -3 (yellow meter zone).",
    changeLanguageHint: "Press Enter to change language",
    editPeakHint: "Edit the value, then press Enter to save",
    backHint: "Tab: switch setting • Esc: save & go back",
  },
  normalize: {
    title: "Balance volumes",
    description:
      "Creates audio.mp3 from each video.mp4 and peak-normalises to {{peak}} dB (yellow meter zone). video.mp4 is left unchanged.",
    pressEnter: "Press Enter to process all songs in the songs folder",
    running: "Balancing volumes…",
    noneFound: "No songs with video.mp4 found.",
    done: "Volume balancing finished.",
    succeeded: "Done:",
    skipped: "Skipped:",
    failed: "Failed:",
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
    settings: "Tab: switch setting • Enter: edit / confirm • Esc: save & back",
    normalize: "Enter: start • Esc: back",
    results:
      "↑/↓: select • Enter: download • ←/→: page • e: edit search • l: language • r: refresh • Esc: back",
    resultsNoDownload:
      "↑/↓: select • ←/→: page • e: edit search • l: language • r: refresh • Esc: back",
  },
  error: {
    label: "Error:",
  },
};
