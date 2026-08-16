import type { TranslationSchema } from "./en-US.ts";

export const jaJP: TranslationSchema = {
  app: {
    title: "UltraStar CLI",
  },
  status: {
    login: "ログイン:",
    loggedIn: "ログイン済み",
    checking: "確認中…",
    notLoggedIn: "未ログイン",
    loginError: "不明なエラーが発生しました。GitHubで報告してください。",
    download: "ダウンロード:",
    native: "ネイティブ",
    ytDlpFallback: " · yt-dlp フォールバック: ",
    available: "利用可能",
    notInstalled: "未インストール",
  },
  loading: {
    initializing: "セッションを初期化中...",
    searching: "検索中...",
  },
  form: {
    artist: "アーティスト:",
    title: "タイトル:",
    language: "言語:",
    settings: "設定",
    artistPlaceholder: "例: Queen",
    titlePlaceholder: "例: Bohemian Rhapsody",
    enterToSelect: "(Enterで選択)",
    pressEnterSearch: "Enterで検索",
    pressEnterLanguage: "Enterで言語を選択",
    pressEnterSettings: "Enterで設定を開く",
  },
  language: {
    any: "すべて",
    selectSongLanguage: "曲の言語を選択",
    selectAppLanguage: "希望の言語を選択",
  },
  results: {
    noResults: "結果がありません。",
    page: "ページ",
    of: "/",
    language: "言語:",
    navigatePages: "←/→ でページ移動",
  },
  downloaded: {
    recentlyDownloaded: "最近ダウンロードした曲",
  },
  settings: {
    title: "設定",
    appLanguage: "アプリの言語:",
    changeHint: "Enterで言語を変更",
    backHint: "Escで戻る",
  },
  localeSetup: {
    title: "UltraStar CLIへようこそ",
    subtitle: "使用する言語を選択してください:",
  },
  help: {
    tips: "ヒント:",
    form: "Tab: フィールド切替 • Enter: 検索 / 選択 • Esc: 終了",
    language: "↑/↓: 選択 • Enter: 確定 • Esc: キャンセル",
    localeSetup: "↑/↓: 選択 • Enter: 確定",
    settings: "Enter: 言語変更 • Esc: 戻る",
    results:
      "↑/↓: 選択 • Enter: ダウンロード • ←/→: ページ • e: 検索編集 • l: 言語 • r: 更新 • Esc: 戻る",
    resultsNoDownload:
      "↑/↓: 選択 • ←/→: ページ • e: 検索編集 • l: 言語 • r: 更新 • Esc: 戻る",
  },
  error: {
    label: "エラー:",
  },
};
