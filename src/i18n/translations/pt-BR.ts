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
    settings: "Configurações",
    artistPlaceholder: "ex.: Queen",
    titlePlaceholder: "ex.: Bohemian Rhapsody",
    enterToSelect: "(Enter para selecionar)",
    pressEnterSearch: "Pressione Enter para buscar",
    pressEnterLanguage: "Pressione Enter para selecionar o idioma",
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
    changeHint: "Pressione Enter para mudar o idioma",
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
    settings: "Enter: mudar idioma • Esc: voltar",
    results:
      "↑/↓: selecionar • Enter: baixar • ←/→: página • e: editar busca • l: idioma • r: atualizar • Esc: voltar",
    resultsNoDownload:
      "↑/↓: selecionar • ←/→: página • e: editar busca • l: idioma • r: atualizar • Esc: voltar",
  },
  error: {
    label: "Erro:",
  },
};
