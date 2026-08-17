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
    normalizeVolumes: "Equilibrar volúmenes",
    settings: "Configuración",
    artistPlaceholder: "ej.: Queen",
    titlePlaceholder: "ej.: Bohemian Rhapsody",
    enterToSelect: "(Enter para seleccionar)",
    pressEnterSearch: "Presioná Enter para buscar",
    pressEnterLanguage: "Presioná Enter para seleccionar el idioma",
    pressEnterNormalize: "Presioná Enter para equilibrar el volumen de todas las canciones",
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
    targetPeakDb: "Pico objetivo:",
    targetPeakDbPlaceholder: "ej.: -3",
    targetPeakDbHint:
      "Objetivo de volumen de pico en dB ({{min}} a {{max}}). El valor predeterminado es -3 (zona amarilla del medidor).",
    changeLanguageHint: "Presioná Enter para cambiar el idioma",
    editPeakHint: "Editá el valor y presioná Enter para guardar",
    backHint: "Tab: cambiar configuración • Esc: guardar y volver",
  },
  normalize: {
    title: "Equilibrar volúmenes",
    description:
      "Crea audio.mp3 a partir de cada video.mp4 y normaliza el pico a {{peak}} dB (zona amarilla del medidor). El video.mp4 no se modifica.",
    pressEnter: "Presioná Enter para procesar todas las canciones de la carpeta songs",
    running: "Equilibrando volúmenes…",
    noneFound: "No se encontraron canciones con video.mp4.",
    done: "Equilibrio de volúmenes finalizado.",
    succeeded: "Listo:",
    skipped: "Omitido:",
    failed: "Falló:",
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
    settings: "Tab: cambiar configuración • Enter: editar / confirmar • Esc: guardar y volver",
    normalize: "Enter: iniciar • Esc: volver",
    results:
      "↑/↓: seleccionar • Enter: descargar • ←/→: página • e: editar búsqueda • l: idioma • r: actualizar • Esc: volver",
    resultsNoDownload:
      "↑/↓: seleccionar • ←/→: página • e: editar búsqueda • l: idioma • r: actualizar • Esc: volver",
  },
  error: {
    label: "Error:",
  },
};
