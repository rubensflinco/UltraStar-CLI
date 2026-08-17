import type { TranslationSchema } from "./en-US.ts";

export const ruRU: TranslationSchema = {
  app: {
    title: "UltraStar CLI",
  },
  status: {
    login: "Вход:",
    loggedIn: "Вы вошли",
    checking: "Проверка…",
    notLoggedIn: "Не выполнен вход",
    loginError: "Произошла неизвестная ошибка. Сообщите о ней на GitHub.",
    download: "Загрузка:",
    native: "Нативная",
    ytDlpFallback: " · запасной yt-dlp: ",
    available: "Доступен",
    notInstalled: "Не установлен",
  },
  loading: {
    initializing: "Инициализация сессии...",
    searching: "Поиск...",
  },
  form: {
    artist: "Исполнитель:",
    title: "Название:",
    language: "Язык:",
    normalizeVolumes: "Выровнять громкость",
    settings: "Настройки",
    artistPlaceholder: "напр. Queen",
    titlePlaceholder: "напр. Bohemian Rhapsody",
    enterToSelect: "(Enter — выбрать)",
    pressEnterSearch: "Нажмите Enter для поиска",
    pressEnterLanguage: "Нажмите Enter, чтобы выбрать язык",
    pressEnterNormalize: "Нажмите Enter, чтобы выровнять громкость всех песен",
    pressEnterSettings: "Нажмите Enter, чтобы открыть настройки",
  },
  language: {
    any: "Любой",
    selectSongLanguage: "Выберите язык песен",
    selectAppLanguage: "Выберите предпочитаемый язык",
  },
  results: {
    noResults: "Нет результатов.",
    page: "Страница",
    of: "из",
    language: "Язык:",
    navigatePages: "Используйте ←/→ для смены страниц",
  },
  downloaded: {
    recentlyDownloaded: "Недавно скачанные",
  },
  settings: {
    title: "Настройки",
    appLanguage: "Язык приложения:",
    targetPeakDb: "Целевой пик:",
    targetPeakDbPlaceholder: "напр. -3",
    targetPeakDbHint:
      "Целевой пиковый уровень громкости в дБ ({{min}}–{{max}}). По умолчанию −3 (жёлтая зона индикатора).",
    changeLanguageHint: "Нажмите Enter, чтобы сменить язык",
    editPeakHint: "Измените значение и нажмите Enter, чтобы сохранить",
    backHint: "Tab: сменить настройку • Esc: сохранить и вернуться",
  },
  normalize: {
    title: "Выровнять громкость",
    description:
      "Создаёт audio.mp3 из каждого video.mp4 и нормализует пик до {{peak}} дБ (жёлтая зона индикатора). video.mp4 остаётся без изменений.",
    pressEnter: "Нажмите Enter, чтобы обработать все песни в папке songs",
    running: "Выравнивание громкости…",
    noneFound: "Песни с video.mp4 не найдены.",
    done: "Выравнивание громкости завершено.",
    succeeded: "Готово:",
    skipped: "Пропущено:",
    failed: "Ошибки:",
    backHint: "Нажмите Esc, чтобы вернуться",
  },
  localeSetup: {
    title: "Добро пожаловать в UltraStar CLI",
    subtitle: "Выберите язык, который хотите использовать:",
  },
  help: {
    tips: "Подсказки:",
    form: "Tab: сменить поле • Enter: поиск / выбор • Esc: выход",
    language: "↑/↓: выбор • Enter: подтвердить • Esc: отмена",
    localeSetup: "↑/↓: выбор • Enter: подтвердить",
    settings: "Tab: сменить настройку • Enter: изменить / подтвердить • Esc: сохранить и назад",
    normalize: "Enter: начать • Esc: назад",
    results:
      "↑/↓: выбор • Enter: скачать • ←/→: страница • e: изменить поиск • l: язык • r: обновить • Esc: назад",
    resultsNoDownload:
      "↑/↓: выбор • ←/→: страница • e: изменить поиск • l: язык • r: обновить • Esc: назад",
  },
  error: {
    label: "Ошибка:",
  },
};
