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
    normalizeVolumes: "Wyrównaj głośność",
    settings: "Ustawienia",
    artistPlaceholder: "np. Queen",
    titlePlaceholder: "np. Bohemian Rhapsody",
    enterToSelect: "(Enter, aby wybrać)",
    pressEnterSearch: "Naciśnij Enter, aby wyszukać",
    pressEnterLanguage: "Naciśnij Enter, aby wybrać język",
    pressEnterNormalize: "Naciśnij Enter, aby wyrównać głośność wszystkich utworów",
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
    targetPeakDb: "Docelowy szczyt:",
    targetPeakDbPlaceholder: "np. -3",
    targetPeakDbHint:
      "Docelowa głośność szczytowa w dB ({{min}} do {{max}}). Domyślnie -3 (żółta strefa miernika).",
    changeLanguageHint: "Naciśnij Enter, aby zmienić język",
    editPeakHint: "Edytuj wartość, a następnie naciśnij Enter, aby zapisać",
    backHint: "Tab: zmień ustawienie • Esc: zapisz i wróć",
  },
  normalize: {
    title: "Wyrównaj głośność",
    description:
      "Tworzy audio.mp3 z każdego video.mp4 i normalizuje szczyt do {{peak}} dB (żółta strefa miernika). video.mp4 pozostaje bez zmian.",
    pressEnter: "Naciśnij Enter, aby przetworzyć wszystkie utwory w folderze songs",
    running: "Wyrównywanie głośności…",
    noneFound: "Nie znaleziono utworów z video.mp4.",
    done: "Wyrównywanie głośności zakończone.",
    succeeded: "Gotowe:",
    skipped: "Pominięto:",
    failed: "Niepowodzenie:",
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
    settings: "Tab: zmień ustawienie • Enter: edytuj / potwierdź • Esc: zapisz i wróć",
    normalize: "Enter: start • Esc: wróć",
    results:
      "↑/↓: wybierz • Enter: pobierz • ←/→: strona • e: edytuj wyszukiwanie • l: język • r: odśwież • Esc: wróć",
    resultsNoDownload:
      "↑/↓: wybierz • ←/→: strona • e: edytuj wyszukiwanie • l: język • r: odśwież • Esc: wróć",
  },
  error: {
    label: "Błąd:",
  },
};
