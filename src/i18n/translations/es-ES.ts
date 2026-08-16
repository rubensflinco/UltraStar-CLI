import type { TranslationSchema } from "./en-US.ts";

export const esES: TranslationSchema = {
  app: {
    title: "UltraStar CLI",
  },
  status: {
    login: "Inicio de sesión:",
    loggedIn: "Conectado",
    checking: "Comprobando…",
    notLoggedIn: "No conectado",
    loginError: "Ocurrió un error desconocido. Infórmalo en GitHub.",
    download: "Descarga:",
    native: "Nativo",
    ytDlpFallback: " · respaldo yt-dlp: ",
    available: "Disponible",
    notInstalled: "No instalado",
  },
  loading: {
    initializing: "Inicializando sesión...",
    searching: "Buscando...",
  },
  form: {
    artist: "Artista:",
    title: "Título:",
    language: "Idioma:",
    settings: "Ajustes",
    artistPlaceholder: "ej.: Queen",
    titlePlaceholder: "ej.: Bohemian Rhapsody",
    enterToSelect: "(Enter para seleccionar)",
    pressEnterSearch: "Pulsa Enter para buscar",
    pressEnterLanguage: "Pulsa Enter para seleccionar el idioma",
    pressEnterSettings: "Pulsa Enter para abrir ajustes",
  },
  language: {
    any: "Cualquiera",
    selectSongLanguage: "Selecciona el idioma de las canciones",
    selectAppLanguage: "Selecciona tu idioma preferido",
  },
  results: {
    noResults: "Sin resultados.",
    page: "Página",
    of: "de",
    language: "Idioma:",
    navigatePages: "Usa ←/→ para navegar las páginas",
  },
  downloaded: {
    recentlyDownloaded: "Descargados recientemente",
  },
  settings: {
    title: "Ajustes",
    appLanguage: "Idioma de la app:",
    changeHint: "Pulsa Enter para cambiar el idioma",
    backHint: "Pulsa Esc para volver",
  },
  localeSetup: {
    title: "Bienvenido a UltraStar CLI",
    subtitle: "Elige el idioma que quieres usar:",
  },
  help: {
    tips: "Consejos:",
    form: "Tab: cambiar campo • Enter: buscar / seleccionar • Esc: salir",
    language: "↑/↓: seleccionar • Enter: confirmar • Esc: cancelar",
    localeSetup: "↑/↓: seleccionar • Enter: confirmar",
    settings: "Enter: cambiar idioma • Esc: volver",
    results:
      "↑/↓: seleccionar • Enter: descargar • ←/→: página • e: editar búsqueda • l: idioma • r: actualizar • Esc: volver",
    resultsNoDownload:
      "↑/↓: seleccionar • ←/→: página • e: editar búsqueda • l: idioma • r: actualizar • Esc: volver",
  },
  error: {
    label: "Error:",
  },
};
