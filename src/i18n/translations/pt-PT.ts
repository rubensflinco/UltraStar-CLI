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
    normalizeVolumes: "Equilibrar volumes",
    settings: "Definições",
    artistPlaceholder: "ex.: Queen",
    titlePlaceholder: "ex.: Bohemian Rhapsody",
    enterToSelect: "(Enter para selecionar)",
    pressEnterSearch: "Prima Enter para pesquisar",
    pressEnterLanguage: "Prima Enter para selecionar o idioma",
    pressEnterNormalize: "Prima Enter para equilibrar o volume de todas as músicas",
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
    targetPeakDb: "Pico alvo:",
    targetPeakDbPlaceholder: "ex.: -3",
    targetPeakDbHint:
      "Alvo de volume de pico em dB ({{min}} a {{max}}). O predefinido é -3 (zona amarela do medidor).",
    changeLanguageHint: "Prima Enter para alterar o idioma",
    editPeakHint: "Edite o valor e prima Enter para guardar",
    backHint: "Tab: mudar definição • Esc: guardar e voltar",
  },
  normalize: {
    title: "Equilibrar volumes",
    description:
      "Cria audio.mp3 a partir de cada video.mp4 e normaliza o pico para {{peak}} dB (zona amarela do medidor). O video.mp4 permanece inalterado.",
    pressEnter: "Prima Enter para processar todas as músicas na pasta songs",
    running: "A equilibrar volumes…",
    noneFound: "Nenhuma música com video.mp4 encontrada.",
    done: "Equilíbrio de volumes concluído.",
    succeeded: "Concluído:",
    skipped: "Ignorado:",
    failed: "Falhou:",
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
    settings: "Tab: mudar definição • Enter: editar / confirmar • Esc: guardar e voltar",
    normalize: "Enter: iniciar • Esc: voltar",
    results:
      "↑/↓: selecionar • Enter: transferir • ←/→: página • e: editar pesquisa • l: idioma • r: atualizar • Esc: voltar",
    resultsNoDownload:
      "↑/↓: selecionar • ←/→: página • e: editar pesquisa • l: idioma • r: atualizar • Esc: voltar",
  },
  error: {
    label: "Erro:",
  },
};
