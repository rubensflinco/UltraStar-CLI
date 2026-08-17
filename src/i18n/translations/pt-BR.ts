import type { TranslationSchema } from "./en-US.ts";

export const ptBR: TranslationSchema = {
  app: {
    title: "UltraStar CLI",
  },
  status: {
    login: "Login:",
    loggedIn: "Conectado",
    checking: "Verificando…",
    notLoggedIn: "Não conectado",
    loginError: "Ocorreu um erro desconhecido. Reporte no GitHub.",
    download: "Download:",
    native: "Nativo",
    ytDlpFallback: " · fallback yt-dlp: ",
    available: "Disponível",
    notInstalled: "Não instalado",
  },
  loading: {
    initializing: "Inicializando sessão...",
    searching: "Buscando...",
  },
  form: {
    artist: "Artista:",
    title: "Título:",
    language: "Idioma:",
    normalizeVolumes: "Equilibrar volumes",
    settings: "Configurações",
    artistPlaceholder: "ex.: Queen",
    titlePlaceholder: "ex.: Bohemian Rhapsody",
    enterToSelect: "(Enter para selecionar)",
    pressEnterSearch: "Pressione Enter para buscar",
    pressEnterLanguage: "Pressione Enter para selecionar o idioma",
    pressEnterNormalize: "Pressione Enter para equilibrar o volume de todas as músicas",
    pressEnterSettings: "Pressione Enter para abrir as configurações",
  },
  language: {
    any: "Qualquer",
    selectSongLanguage: "Selecione o idioma das músicas",
    selectAppLanguage: "Selecione o idioma preferido",
  },
  results: {
    noResults: "Nenhum resultado.",
    page: "Página",
    of: "de",
    language: "Idioma:",
    navigatePages: "Use ←/→ para navegar nas páginas",
  },
  downloaded: {
    recentlyDownloaded: "Baixados recentemente",
  },
  settings: {
    title: "Configurações",
    appLanguage: "Idioma do app:",
    targetPeakDb: "Pico alvo:",
    targetPeakDbPlaceholder: "ex.: -3",
    targetPeakDbHint:
      "Alvo de volume de pico em dB ({{min}} a {{max}}). O padrão é -3 (zona amarela do medidor).",
    changeLanguageHint: "Pressione Enter para mudar o idioma",
    editPeakHint: "Edite o valor e pressione Enter para salvar",
    backHint: "Tab: trocar configuração • Esc: salvar e voltar",
  },
  normalize: {
    title: "Equilibrar volumes",
    description:
      "Cria audio.mp3 a partir de cada video.mp4 e normaliza o pico para {{peak}} dB (zona amarela do medidor). O video.mp4 permanece inalterado.",
    pressEnter: "Pressione Enter para processar todas as músicas na pasta songs",
    running: "Equilibrando volumes…",
    noneFound: "Nenhuma música com video.mp4 encontrada.",
    done: "Equilíbrio de volumes concluído.",
    succeeded: "Concluído:",
    skipped: "Ignorado:",
    failed: "Falhou:",
    backHint: "Pressione Esc para voltar",
  },
  localeSetup: {
    title: "Bem-vindo ao UltraStar CLI",
    subtitle: "Escolha o idioma que deseja usar:",
  },
  help: {
    tips: "Dicas:",
    form: "Tab: trocar campo • Enter: buscar / selecionar • Esc: sair",
    language: "↑/↓: selecionar • Enter: confirmar • Esc: cancelar",
    localeSetup: "↑/↓: selecionar • Enter: confirmar",
    settings: "Tab: trocar configuração • Enter: editar / confirmar • Esc: salvar e voltar",
    normalize: "Enter: iniciar • Esc: voltar",
    results:
      "↑/↓: selecionar • Enter: baixar • ←/→: página • e: editar busca • l: idioma • r: atualizar • Esc: voltar",
    resultsNoDownload:
      "↑/↓: selecionar • ←/→: página • e: editar busca • l: idioma • r: atualizar • Esc: voltar",
  },
  error: {
    label: "Erro:",
  },
};
