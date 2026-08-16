import type { TranslationSchema } from "./en-US.ts";

export const zhCN: TranslationSchema = {
  app: {
    title: "UltraStar CLI",
  },
  status: {
    login: "登录:",
    loggedIn: "已登录",
    checking: "检查中…",
    notLoggedIn: "未登录",
    loginError: "发生未知错误。请在 GitHub 上反馈。",
    download: "下载:",
    native: "原生",
    ytDlpFallback: " · yt-dlp 备用: ",
    available: "可用",
    notInstalled: "未安装",
  },
  loading: {
    initializing: "正在初始化会话...",
    searching: "正在搜索...",
  },
  form: {
    artist: "歌手:",
    title: "标题:",
    language: "语言:",
    settings: "设置",
    artistPlaceholder: "例如: Queen",
    titlePlaceholder: "例如: Bohemian Rhapsody",
    enterToSelect: "(按 Enter 选择)",
    pressEnterSearch: "按 Enter 搜索",
    pressEnterLanguage: "按 Enter 选择语言",
    pressEnterSettings: "按 Enter 打开设置",
  },
  language: {
    any: "任意",
    selectSongLanguage: "选择歌曲语言",
    selectAppLanguage: "选择您偏好的语言",
  },
  results: {
    noResults: "没有结果。",
    page: "第",
    of: "页，共",
    language: "语言:",
    navigatePages: "使用 ←/→ 翻页",
  },
  downloaded: {
    recentlyDownloaded: "最近下载",
  },
  settings: {
    title: "设置",
    appLanguage: "应用语言:",
    changeHint: "按 Enter 更改语言",
    backHint: "按 Esc 返回",
  },
  localeSetup: {
    title: "欢迎使用 UltraStar CLI",
    subtitle: "请选择您要使用的语言:",
  },
  help: {
    tips: "提示:",
    form: "Tab: 切换字段 • Enter: 搜索 / 选择 • Esc: 退出",
    language: "↑/↓: 选择 • Enter: 确认 • Esc: 取消",
    localeSetup: "↑/↓: 选择 • Enter: 确认",
    settings: "Enter: 更改语言 • Esc: 返回",
    results:
      "↑/↓: 选择 • Enter: 下载 • ←/→: 翻页 • e: 编辑搜索 • l: 语言 • r: 刷新 • Esc: 返回",
    resultsNoDownload:
      "↑/↓: 选择 • ←/→: 翻页 • e: 编辑搜索 • l: 语言 • r: 刷新 • Esc: 返回",
  },
  error: {
    label: "错误:",
  },
};
