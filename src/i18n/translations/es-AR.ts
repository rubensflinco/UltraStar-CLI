import type { TranslationSchema } from "./en-US.ts";

export const esAR: TranslationSchema = {
  app: {
    title: "UltraStar CLI",
  },
  status: {
    login: "Inicio de sesión:",
    loggedIn: "Conectado",
    checking: "Verificando…",
    notLoggedIn: "No conectado",
    loginError: "Ocurrió un error desconocido. Reportalo en GitHub.",
    download: "Descarga:",
    native: "Nativo",
    ytDlpFallback: " · fallback yt-dlp: ",
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
    settings: "Configuración",
    artistPlaceholder: "ej.: Queen",
    titlePlaceholder: "ej.: Bohemian Rhapsody",
    enterToSelect: "(Enter para seleccionar)",
    pressEnterSearch: "Presioná Enter para buscar",
    pressEnterLanguage: "Presioná Enter para seleccionar el idioma",
    pressEnterSettings: "Presioná Enter para abrir la configuración",
  },
  language: {
    any: "Cualquiera",
    selectSongLanguage: "Seleccioná el idioma de las canciones",
    selectAppLanguage: "Seleccioná tu idioma preferido",
  },
  results: {
    noResults: "Sin resultados.",
    page: "Página",
    of: "de",
    language: "Idioma:",
    navigatePages: "Usá ←/→ para navegar las páginas",
  },
  downloaded: {
    recentlyDownloaded: "Descargados recientemente",
  },
  settings: {
    title: "Configuración",
    appLanguage: "Idioma de la app:",
    changeHint: "Presioná Enter para cambiar el idioma",
    backHint: "Presioná Esc para volver",
  },
  localeSetup: {
    title: "Bienvenido a UltraStar CLI",
    subtitle: "Elegí el idioma que querés usar:",
  },
  help: {
    tips: "Tips:",
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
