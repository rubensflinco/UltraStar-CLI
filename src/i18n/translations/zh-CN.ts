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
    normalizeVolumes: "平衡音量",
    settings: "设置",
    artistPlaceholder: "例如: Queen",
    titlePlaceholder: "例如: Bohemian Rhapsody",
    enterToSelect: "(按 Enter 选择)",
    pressEnterSearch: "按 Enter 搜索",
    pressEnterLanguage: "按 Enter 选择语言",
    pressEnterNormalize: "按 Enter 平衡所有歌曲音量",
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
    targetPeakDb: "目标峰值:",
    targetPeakDbPlaceholder: "例如: -3",
    targetPeakDbHint:
      "峰值音量目标（dB）（{{min}} 至 {{max}}）。默认为 -3（仪表黄色区域）。",
    changeLanguageHint: "按 Enter 更改语言",
    editPeakHint: "编辑数值后按 Enter 保存",
    backHint: "Tab: 切换设置 • Esc: 保存并返回",
  },
  normalize: {
    title: "平衡音量",
    description:
      "从每个 video.mp4 创建 audio.mp3，并将峰值归一化到 {{peak}} dB（仪表黄色区域）。video.mp4 保持不变。",
    pressEnter: "按 Enter 处理 songs 文件夹中的所有歌曲",
    running: "正在平衡音量…",
    noneFound: "未找到包含 video.mp4 的歌曲。",
    done: "音量平衡已完成。",
    succeeded: "完成:",
    skipped: "跳过:",
    failed: "失败:",
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
    settings: "Tab: 切换设置 • Enter: 编辑 / 确认 • Esc: 保存并返回",
    normalize: "Enter: 开始 • Esc: 返回",
    results:
      "↑/↓: 选择 • Enter: 下载 • ←/→: 翻页 • e: 编辑搜索 • l: 语言 • r: 刷新 • Esc: 返回",
    resultsNoDownload:
      "↑/↓: 选择 • ←/→: 翻页 • e: 编辑搜索 • l: 语言 • r: 刷新 • Esc: 返回",
  },
  error: {
    label: "错误:",
  },
};
