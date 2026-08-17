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
    normalizeVolumes: "Equilibrar volúmenes",
    settings: "Ajustes",
    artistPlaceholder: "ej.: Queen",
    titlePlaceholder: "ej.: Bohemian Rhapsody",
    enterToSelect: "(Enter para seleccionar)",
    pressEnterSearch: "Pulsa Enter para buscar",
    pressEnterLanguage: "Pulsa Enter para seleccionar el idioma",
    pressEnterNormalize: "Pulsa Enter para equilibrar el volumen de todas las canciones",
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
    targetPeakDb: "Pico objetivo:",
    targetPeakDbPlaceholder: "ej.: -3",
    targetPeakDbHint:
      "Objetivo de volumen de pico en dB ({{min}} a {{max}}). El valor predeterminado es -3 (zona amarilla del medidor).",
    changeLanguageHint: "Pulsa Enter para cambiar el idioma",
    editPeakHint: "Edita el valor y pulsa Enter para guardar",
    backHint: "Tab: cambiar ajuste • Esc: guardar y volver",
  },
  normalize: {
    title: "Equilibrar volúmenes",
    description:
      "Crea audio.mp3 a partir de cada video.mp4 y normaliza el pico a {{peak}} dB (zona amarilla del medidor). El video.mp4 no se modifica.",
    pressEnter: "Pulsa Enter para procesar todas las canciones de la carpeta songs",
    running: "Equilibrando volúmenes…",
    noneFound: "No se encontraron canciones con video.mp4.",
    done: "Equilibrio de volúmenes finalizado.",
    succeeded: "Completado:",
    skipped: "Omitido:",
    failed: "Fallido:",
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
    settings: "Tab: cambiar ajuste • Enter: editar / confirmar • Esc: guardar y volver",
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
