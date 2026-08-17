import { Box, Text } from "ink";
import TextInput from "ink-text-input";
import type { FC } from "react";
import { formatLanguageLabel } from "../../api/usdb/languages.ts";
import { useI18n } from "../../i18n/I18nProvider.tsx";

export type FocusedField =
  | "artist"
  | "title"
  | "language"
  | "normalize"
  | "settings";

export type SearchFormProps = {
  artist: string;
  title: string;
  language: string;
  limit: number;
  focusedField: FocusedField;
  setArtist: (v: string) => void;
  setTitle: (v: string) => void;
};

export const SearchForm: FC<SearchFormProps> = ({
  artist,
  title,
  language,
  focusedField,
  setArtist,
  setTitle,
}) => {
  const { t } = useI18n();
  const languageLabel = language
    ? formatLanguageLabel(language)
    : t("language.any");

  const hint =
    focusedField === "language"
      ? t("form.pressEnterLanguage")
      : focusedField === "normalize"
        ? t("form.pressEnterNormalize")
        : focusedField === "settings"
          ? t("form.pressEnterSettings")
          : t("form.pressEnterSearch");

  return (
    <Box flexDirection="column" gap={1}>
      <Box>
        <Box width={12}>
          <Text color="white" bold>
            {t("form.artist")}
          </Text>
        </Box>
        <TextInput
          value={artist}
          onChange={setArtist}
          focus={focusedField === "artist"}
          placeholder={t("form.artistPlaceholder")}
        />
      </Box>
      <Box>
        <Box width={12}>
          <Text color="white" bold>
            {t("form.title")}
          </Text>
        </Box>
        <TextInput
          value={title}
          onChange={setTitle}
          focus={focusedField === "title"}
          placeholder={t("form.titlePlaceholder")}
        />
      </Box>
      <Box>
        <Box width={12}>
          <Text
            color={focusedField === "language" ? "cyanBright" : "white"}
            bold
          >
            {t("form.language")}
          </Text>
        </Box>
        <Text
          color={focusedField === "language" ? "cyanBright" : "gray"}
          bold={focusedField === "language"}
        >
          {focusedField === "language" ? `> ${languageLabel}` : languageLabel}
        </Text>
        {focusedField === "language" && (
          <Text dimColor>
            {"  "}
            {t("form.enterToSelect")}
          </Text>
        )}
      </Box>

      <Box marginTop={2}>
        <Text
          color={focusedField === "normalize" ? "cyanBright" : "white"}
          bold
        >
          {focusedField === "normalize"
            ? `> ${t("form.normalizeVolumes")}`
            : t("form.normalizeVolumes")}
        </Text>
        {focusedField === "normalize" && (
          <Text dimColor>
            {"  "}
            {t("form.enterToSelect")}
          </Text>
        )}
      </Box>

      <Box>
        <Text color={focusedField === "settings" ? "cyanBright" : "white"} bold>
          {focusedField === "settings"
            ? `> ${t("form.settings")}`
            : t("form.settings")}
        </Text>
        {focusedField === "settings" && (
          <Text dimColor>
            {"  "}
            {t("form.enterToSelect")}
          </Text>
        )}
      </Box>

      <Box>
        <Text color="green">{hint}</Text>
      </Box>
    </Box>
  );
};

export default SearchForm;
