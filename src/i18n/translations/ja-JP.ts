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
    normalizeVolumes: "音量を揃える",
    settings: "設定",
    artistPlaceholder: "例: Queen",
    titlePlaceholder: "例: Bohemian Rhapsody",
    enterToSelect: "(Enterで選択)",
    pressEnterSearch: "Enterで検索",
    pressEnterLanguage: "Enterで言語を選択",
    pressEnterNormalize: "Enterですべての曲の音量を揃える",
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
    targetPeakDb: "目標ピーク:",
    targetPeakDbPlaceholder: "例: -3",
    targetPeakDbHint:
      "ピーク音量の目標値（dB）（{{min}}〜{{max}}）。デフォルトは -3（メーターの黄色ゾーン）。",
    changeLanguageHint: "Enterで言語を変更",
    editPeakHint: "値を編集し、Enterで保存",
    backHint: "Tab: 設定切替 • Esc: 保存して戻る",
  },
  normalize: {
    title: "音量を揃える",
    description:
      "各video.mp4からaudio.mp3を作成し、ピークを{{peak}} dBに正規化します（メーターの黄色ゾーン）。video.mp4はそのまま残ります。",
    pressEnter: "Enterでsongsフォルダ内のすべての曲を処理",
    running: "音量を揃えています…",
    noneFound: "video.mp4がある曲が見つかりません。",
    done: "音量の調整が完了しました。",
    succeeded: "完了:",
    skipped: "スキップ:",
    failed: "失敗:",
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
    settings: "Tab: 設定切替 • Enter: 編集 / 確定 • Esc: 保存して戻る",
    normalize: "Enter: 開始 • Esc: 戻る",
    results:
      "↑/↓: 選択 • Enter: ダウンロード • ←/→: ページ • e: 検索編集 • l: 言語 • r: 更新 • Esc: 戻る",
    resultsNoDownload:
      "↑/↓: 選択 • ←/→: ページ • e: 検索編集 • l: 言語 • r: 更新 • Esc: 戻る",
  },
  error: {
    label: "エラー:",
  },
};
