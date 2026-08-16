import type { TranslationSchema } from "./en-US.ts";

export const ptPT: TranslationSchema = {
  app: {
    title: "UltraStar CLI",
  },
  status: {
    login: "Sessão:",
    loggedIn: "Sessão iniciada",
    checking: "A verificar…",
    notLoggedIn: "Sem sessão",
    loginError: "Ocorreu um erro desconhecido. Reporte no GitHub.",
    download: "Transferência:",
    native: "Nativo",
    ytDlpFallback: " · fallback yt-dlp: ",
    available: "Disponível",
    notInstalled: "Não instalado",
  },
  loading: {
    initializing: "A iniciar sessão...",
    searching: "A pesquisar...",
  },
  form: {
    artist: "Artista:",
    title: "Título:",
    language: "Idioma:",
    settings: "Definições",
    artistPlaceholder: "ex.: Queen",
    titlePlaceholder: "ex.: Bohemian Rhapsody",
    enterToSelect: "(Enter para selecionar)",
    pressEnterSearch: "Prima Enter para pesquisar",
    pressEnterLanguage: "Prima Enter para selecionar o idioma",
    pressEnterSettings: "Prima Enter para abrir as definições",
  },
  language: {
    any: "Qualquer",
    selectSongLanguage: "Selecione o idioma das músicas",
    selectAppLanguage: "Selecione o idioma preferido",
  },
  results: {
    noResults: "Sem resultados.",
    page: "Página",
    of: "de",
    language: "Idioma:",
    navigatePages: "Use ←/→ para navegar nas páginas",
  },
  downloaded: {
    recentlyDownloaded: "Transferidos recentemente",
  },
  settings: {
    title: "Definições",
    appLanguage: "Idioma da aplicação:",
    changeHint: "Prima Enter para alterar o idioma",
    backHint: "Prima Esc para voltar",
  },
  localeSetup: {
    title: "Bem-vindo ao UltraStar CLI",
    subtitle: "Escolha o idioma que deseja utilizar:",
  },
  help: {
    tips: "Dicas:",
    form: "Tab: mudar campo • Enter: pesquisar / selecionar • Esc: sair",
    language: "↑/↓: selecionar • Enter: confirmar • Esc: cancelar",
    localeSetup: "↑/↓: selecionar • Enter: confirmar",
    settings: "Enter: alterar idioma • Esc: voltar",
    results:
      "↑/↓: selecionar • Enter: transferir • ←/→: página • e: editar pesquisa • l: idioma • r: atualizar • Esc: voltar",
    resultsNoDownload:
      "↑/↓: selecionar • ←/→: página • e: editar pesquisa • l: idioma • r: atualizar • Esc: voltar",
  },
  error: {
    label: "Erro:",
  },
};
