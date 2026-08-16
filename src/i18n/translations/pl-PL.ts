import type { TranslationSchema } from "./en-US.ts";

export const plPL: TranslationSchema = {
  app: {
    title: "UltraStar CLI",
  },
  status: {
    login: "Logowanie:",
    loggedIn: "Zalogowano",
    checking: "Sprawdzanie…",
    notLoggedIn: "Niezalogowano",
    loginError: "Wystąpił nieznany błąd. Zgłoś go na GitHub.",
    download: "Pobieranie:",
    native: "Natywne",
    ytDlpFallback: " · zapasowe yt-dlp: ",
    available: "Dostępne",
    notInstalled: "Nie zainstalowano",
  },
  loading: {
    initializing: "Inicjalizacja sesji...",
    searching: "Wyszukiwanie...",
  },
  form: {
    artist: "Artysta:",
    title: "Tytuł:",
    language: "Język:",
    settings: "Ustawienia",
    artistPlaceholder: "np. Queen",
    titlePlaceholder: "np. Bohemian Rhapsody",
    enterToSelect: "(Enter, aby wybrać)",
    pressEnterSearch: "Naciśnij Enter, aby wyszukać",
    pressEnterLanguage: "Naciśnij Enter, aby wybrać język",
    pressEnterSettings: "Naciśnij Enter, aby otworzyć ustawienia",
  },
  language: {
    any: "Dowolny",
    selectSongLanguage: "Wybierz język utworów",
    selectAppLanguage: "Wybierz preferowany język",
  },
  results: {
    noResults: "Brak wyników.",
    page: "Strona",
    of: "z",
    language: "Język:",
    navigatePages: "Użyj ←/→ do zmiany stron",
  },
  downloaded: {
    recentlyDownloaded: "Ostatnio pobrane",
  },
  settings: {
    title: "Ustawienia",
    appLanguage: "Język aplikacji:",
    changeHint: "Naciśnij Enter, aby zmienić język",
    backHint: "Naciśnij Esc, aby wrócić",
  },
  localeSetup: {
    title: "Witamy w UltraStar CLI",
    subtitle: "Wybierz język, którego chcesz używać:",
  },
  help: {
    tips: "Wskazówki:",
    form: "Tab: zmień pole • Enter: szukaj / wybierz • Esc: wyjdź",
    language: "↑/↓: wybierz • Enter: potwierdź • Esc: anuluj",
    localeSetup: "↑/↓: wybierz • Enter: potwierdź",
    settings: "Enter: zmień język • Esc: wróć",
    results:
      "↑/↓: wybierz • Enter: pobierz • ←/→: strona • e: edytuj wyszukiwanie • l: język • r: odśwież • Esc: wróć",
    resultsNoDownload:
      "↑/↓: wybierz • ←/→: strona • e: edytuj wyszukiwanie • l: język • r: odśwież • Esc: wróć",
  },
  error: {
    label: "Błąd:",
  },
};
