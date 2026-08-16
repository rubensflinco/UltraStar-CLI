import { Effect } from "effect";
import { Box, Text, useApp, useInput } from "ink";
import type { FC } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { formatLanguageLabel } from "../api/usdb/languages.ts";
import { type Page, type Song, searchSongs } from "../api/usdb/search.ts";
import { checkYtDlpAvailable } from "../api/youtube/check.ts";
import { warmupInnertube } from "../api/youtube/client.ts";
import { useI18n } from "../i18n/I18nProvider.tsx";
import {
  type AppLocaleCode,
  DEFAULT_LOCALE,
  getUsdbLanguageForLocale,
} from "../i18n/locales.ts";
import { ytDlpInstallHint } from "../platform.ts";
import { ensureSession } from "../session.ts";
import { saveConfig } from "../storage/config.ts";
import {
  appendDownloadedEntry,
  type DownloadedEntry,
  loadDownloadedEntries,
} from "../storage/downloaded.ts";
import DownloadedList from "./components/DownloadedList.tsx";
import HelpRow, { type Mode } from "./components/HelpRow.tsx";
import LanguageSelect from "./components/LanguageSelect.tsx";
import LoadingRow from "./components/LoadingRow.tsx";
import LocaleSelect from "./components/LocaleSelect.tsx";
import SearchForm, { type FocusedField } from "./components/SearchForm.tsx";
import Select from "./components/Select.tsx";
import SettingsScreen from "./components/SettingsScreen.tsx";
import { downloadSong } from "./downloadSong.ts";

type LanguageReturnMode = "form" | "results";

export type AppProps = {
  initialLocale: AppLocaleCode | null;
};

const nextFocusedField = (prev: FocusedField): FocusedField => {
  if (prev === "artist") return "title";
  if (prev === "title") return "language";
  if (prev === "language") return "settings";
  return "artist";
};

export const App: FC<AppProps> = ({ initialLocale }) => {
  const { exit } = useApp();
  const { t, locale, setLocale } = useI18n();

  const needsLocaleSetup = initialLocale === null;
  const [mode, setMode] = useState<Mode>(
    needsLocaleSetup ? "localeSetup" : "form",
  );
  const [focusedField, setFocusedField] = useState<FocusedField>("artist");
  const [languageReturnMode, setLanguageReturnMode] =
    useState<LanguageReturnMode>("form");

  const [artist, setArtist] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [language, setLanguage] = useState<string>(() =>
    initialLocale ? getUsdbLanguageForLocale(initialLocale) : "",
  );
  const [pendingLanguage, setPendingLanguage] = useState<string>("");
  const [pendingLocale, setPendingLocale] = useState<AppLocaleCode>(
    initialLocale ?? DEFAULT_LOCALE,
  );
  const [limit] = useState<number>(20);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [songs, setSongs] = useState<Song[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const [_user, setUser] = useState<string>("");
  const [cookie, setCookie] = useState<string>("");

  const [ytAvailable, setYtAvailable] = useState<boolean | null>(null);

  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeDownloads, setActiveDownloads] = useState<
    Array<{ apiId: number; artist: string; title: string; progress: number }>
  >([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [downloadedEntries, setDownloadedEntries] = useState<DownloadedEntry[]>(
    [],
  );

  const canPaginate = useMemo(() => totalPages > 1, [totalPages]);

  useEffect(() => {
    let isMounted = true;
    const run = async () => {
      try {
        setIsInitializing(true);
        const session = await Effect.runPromise(ensureSession);
        if (!isMounted) return;
        setCookie(session.cookie);
        setUser(session.user);
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        setErrorMessage(message);
      } finally {
        setIsInitializing(false);
      }
    };
    void run();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let canceled = false;
    (async () => {
      const [ok] = await Promise.all([
        Effect.runPromise(checkYtDlpAvailable),
        warmupInnertube(),
      ]);
      if (!canceled) setYtAvailable(ok);
    })();
    return () => {
      canceled = true;
    };
  }, []);

  useEffect(() => {
    const run = async () => {
      const entries = await Effect.runPromise(loadDownloadedEntries);
      setDownloadedEntries(entries);
    };
    void run();
  }, []);

  const applyLocale = useCallback(
    async (nextLocale: AppLocaleCode, syncSongLanguage: boolean) => {
      await setLocale(nextLocale);
      await Effect.runPromise(saveConfig({ locale: nextLocale }));
      if (syncSongLanguage) {
        setLanguage(getUsdbLanguageForLocale(nextLocale));
      }
    },
    [setLocale],
  );

  const fetchPage = useCallback(
    async (pageNumber: number, languageOverride?: string) => {
      if (!cookie) return;
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const pageStart = (pageNumber - 1) * limit;
        const languageFilter =
          languageOverride !== undefined ? languageOverride : language;
        const page: Page = await Effect.runPromise(
          searchSongs(
            {
              interpret: artist.trim() || undefined,
              title: title.trim() || undefined,
              language: languageFilter.trim() || undefined,
              limit,
              start: pageStart,
            },
            cookie,
          ),
        );
        setSongs(page.songs);
        setSelectedIndex(0);
        setTotalPages(page.totalPages || 0);
        setCurrentPage(pageNumber);
        setMode("results");
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        setErrorMessage(message);
      } finally {
        setIsLoading(false);
      }
    },
    [artist, title, language, cookie, limit],
  );

  const openLanguageSelect = useCallback(
    (returnMode: LanguageReturnMode) => {
      setLanguageReturnMode(returnMode);
      setPendingLanguage(language);
      setMode("language");
    },
    [language],
  );

  const confirmLanguageSelect = useCallback(() => {
    setLanguage(pendingLanguage);
    if (languageReturnMode === "results") {
      void fetchPage(1, pendingLanguage);
      return;
    }
    setMode("form");
    setFocusedField("artist");
  }, [pendingLanguage, languageReturnMode, fetchPage]);

  const cancelLanguageSelect = useCallback(() => {
    setMode(languageReturnMode);
  }, [languageReturnMode]);

  const confirmLocaleSetup = useCallback(async () => {
    await applyLocale(pendingLocale, true);
    setMode("form");
    setFocusedField("artist");
  }, [applyLocale, pendingLocale]);

  const confirmSettingsLocale = useCallback(async () => {
    await applyLocale(pendingLocale, true);
    setMode("settings");
  }, [applyLocale, pendingLocale]);

  const onSubmitSearch = useCallback(() => {
    void fetchPage(1);
  }, [fetchPage]);

  const downloadSelectedSong = useCallback(
    async (index?: number) => {
      const song = songs[index ?? selectedIndex];
      if (!song || !cookie) return;

      if (activeDownloads.some((d) => d.apiId === song.apiId)) return;

      setErrorMessage(null);
      setActiveDownloads((prev) => [
        ...prev,
        {
          apiId: song.apiId,
          artist: song.artist,
          title: song.title,
          progress: 0,
        },
      ]);

      try {
        const result = await Effect.runPromise(
          downloadSong({
            song,
            cookie,
            onProgress: (p) =>
              setActiveDownloads((prev) =>
                prev.map((d) =>
                  d.apiId === song.apiId ? { ...d, progress: p } : d,
                ),
              ),
          }),
        );

        try {
          const updated = await Effect.runPromise(
            appendDownloadedEntry({
              apiId: song.apiId,
              artist: song.artist,
              title: song.title,
              dirName: result.dirName,
              songDir: result.songDir,
              downloadedAt: new Date().toISOString(),
            }),
          );
          setDownloadedEntries(updated);
        } catch {}
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        setErrorMessage(message);
      } finally {
        setActiveDownloads((prev) =>
          prev.filter((d) => d.apiId !== song.apiId),
        );
      }
    },
    [songs, selectedIndex, cookie, activeDownloads],
  );

  useInput((input, key) => {
    if (key.escape) {
      if (mode === "localeSetup") {
        exit();
        return;
      }
      if (mode === "settingsLocale") {
        setMode("settings");
        return;
      }
      if (mode === "settings") {
        setMode("form");
        setFocusedField("settings");
        return;
      }
      if (mode === "language") {
        cancelLanguageSelect();
        return;
      }
      if (mode === "results") {
        setMode("form");
        return;
      }
      if (mode === "form") {
        exit();
        return;
      }
    }

    if (mode === "form") {
      if (key.tab) {
        setFocusedField(nextFocusedField);
        return;
      }
      if (key.return) {
        if (focusedField === "language") {
          openLanguageSelect("form");
          return;
        }
        if (focusedField === "settings") {
          setPendingLocale(locale);
          setMode("settings");
          return;
        }
        onSubmitSearch();
        return;
      }
    } else if (mode === "localeSetup") {
      if (key.return) {
        void confirmLocaleSetup();
        return;
      }
    } else if (mode === "settings") {
      if (key.return) {
        setPendingLocale(locale);
        setMode("settingsLocale");
        return;
      }
    } else if (mode === "settingsLocale") {
      if (key.return) {
        void confirmSettingsLocale();
        return;
      }
    } else if (mode === "language") {
      if (key.return) {
        confirmLanguageSelect();
        return;
      }
    } else if (mode === "results") {
      if (input === "e") {
        setMode("form");
        return;
      }
      if (input === "l") {
        openLanguageSelect("results");
        return;
      }
      if (input === "r") {
        void fetchPage(currentPage);
        return;
      }
      if (key.return && !isLoading) {
        void downloadSelectedSong();
        return;
      }
      if (key.leftArrow) {
        if (currentPage > 1) void fetchPage(currentPage - 1);
        return;
      }
      if (key.rightArrow) {
        if (totalPages === 0 || currentPage < totalPages) {
          void fetchPage(currentPage + 1);
        }
        return;
      }
    }
  });

  const showMainChrome = mode !== "localeSetup";

  return (
    <Box flexDirection="column" gap={1}>
      <Box>
        <Text color="magentaBright" bold underline>
          {t("app.title")}
        </Text>
      </Box>

      {showMainChrome && (
        <Box flexDirection="column">
          <Text>
            <Text color="white" bold>
              {t("status.login")}
            </Text>{" "}
            {cookie ? (
              <Text color="greenBright">{t("status.loggedIn")}</Text>
            ) : isInitializing ? (
              <Text color="yellow">{t("status.checking")}</Text>
            ) : (
              <Text color="red">{t("status.notLoggedIn")}</Text>
            )}
          </Text>
          {!isInitializing && !cookie && (
            <Text color="red">{t("status.loginError")}</Text>
          )}
          <Text>
            <Text color="white" bold>
              {t("status.download")}
            </Text>{" "}
            <Text color="greenBright">{t("status.native")}</Text>
            <Text color="gray">{t("status.ytDlpFallback")}</Text>
            {ytAvailable == null ? (
              <Text color="yellow">{t("status.checking")}</Text>
            ) : ytAvailable ? (
              <Text color="greenBright">{t("status.available")}</Text>
            ) : (
              <Text>
                <Text color="yellow">{t("status.notInstalled")}</Text>
                <Text dimColor>
                  {" "}
                  ({ytDlpInstallHint()} See
                  https://github.com/yt-dlp/yt-dlp#installation)
                </Text>
              </Text>
            )}
          </Text>
        </Box>
      )}

      {mode === "localeSetup" ? (
        <>
          <LocaleSelect
            value={pendingLocale}
            onChange={setPendingLocale}
            titleKey="localeSetup.subtitle"
            showWelcome
          />
          <HelpRow mode={mode} canDownload />
        </>
      ) : isInitializing ? (
        <LoadingRow label={t("loading.initializing")} />
      ) : (
        <>
          {mode === "form" && (
            <SearchForm
              artist={artist}
              title={title}
              language={language}
              limit={limit}
              focusedField={focusedField}
              setArtist={setArtist}
              setTitle={setTitle}
            />
          )}

          {mode === "language" && (
            <LanguageSelect
              value={pendingLanguage}
              onChange={setPendingLanguage}
            />
          )}

          {mode === "settings" && <SettingsScreen />}

          {mode === "settingsLocale" && (
            <LocaleSelect value={pendingLocale} onChange={setPendingLocale} />
          )}

          {mode === "results" && (
            <Box flexDirection="row">
              <Box flexDirection="column" width={"50%"}>
                {isLoading ? (
                  <LoadingRow label={t("loading.searching")} />
                ) : (
                  <>
                    {songs.length === 0 ? (
                      <Text color="yellow">{t("results.noResults")}</Text>
                    ) : (
                      <Select
                        options={songs.map((s, i) => ({
                          label: (
                            <Text>
                              <Text color="yellowBright">{s.artist}</Text>
                              <Text color="gray"> - </Text>
                              <Text color="cyanBright">{s.title}</Text>
                              {s.languages.length > 0 && (
                                <Text>
                                  {" "}
                                  <Text color="gray">[</Text>
                                  <Text color="magentaBright">
                                    {s.languages.join(", ")}
                                  </Text>
                                  <Text color="gray">]</Text>
                                </Text>
                              )}
                            </Text>
                          ),
                          value: String(i),
                        }))}
                        onChange={(v: string) => {
                          const idx = Number(v);
                          setSelectedIndex(idx);
                        }}
                        visibleOptionCount={20}
                        value={String(selectedIndex)}
                      />
                    )}
                    <Box>
                      <Text>
                        <Text color="white" bold>
                          {t("results.page")}
                        </Text>{" "}
                        <Text color="cyanBright" bold>
                          {totalPages === 0 ? 0 : currentPage}
                        </Text>{" "}
                        <Text color="white" bold>
                          {t("results.of")}
                        </Text>{" "}
                        <Text color="cyanBright" bold>
                          {totalPages}
                        </Text>
                        {language ? (
                          <>
                            <Text color="gray"> · </Text>
                            <Text color="white" bold>
                              {t("results.language")}
                            </Text>{" "}
                            <Text color="magentaBright">
                              {formatLanguageLabel(language)}
                            </Text>
                          </>
                        ) : null}
                      </Text>
                    </Box>
                    {canPaginate && (
                      <Text dimColor>{t("results.navigatePages")}</Text>
                    )}
                  </>
                )}
              </Box>
              <Box flexDirection="column" width={"40%"}>
                <DownloadedList
                  entries={downloadedEntries}
                  currentDownloading={activeDownloads.map((d) => ({
                    artist: d.artist,
                    title: d.title,
                    progress: d.progress,
                  }))}
                />
              </Box>
            </Box>
          )}

          {errorMessage && (
            <Text>
              <Text color="red" bold>
                {t("error.label")}
              </Text>{" "}
              <Text color="red">{errorMessage}</Text>
            </Text>
          )}

          <HelpRow mode={mode} canDownload />
        </>
      )}
    </Box>
  );
};

export default App;
