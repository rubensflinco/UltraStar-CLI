import { Box, Text } from "ink";
import TextInput from "ink-text-input";
import type { FC } from "react";
import { formatLanguageLabel } from "../../api/usdb/languages.ts";

export type FocusedField = "artist" | "title" | "language";

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
  const languageLabel = language
    ? formatLanguageLabel(language)
    : "Any";

  return (
    <Box flexDirection="column" gap={1}>
      <Box>
        <Box width={10}>
          <Text color="white" bold>
            Artist:
          </Text>
        </Box>
        <TextInput
          value={artist}
          onChange={setArtist}
          focus={focusedField === "artist"}
          placeholder="e.g. Queen"
        />
      </Box>
      <Box>
        <Box width={10}>
          <Text color="white" bold>
            Title:
          </Text>
        </Box>
        <TextInput
          value={title}
          onChange={setTitle}
          focus={focusedField === "title"}
          placeholder="e.g. Bohemian Rhapsody"
        />
      </Box>
      <Box>
        <Box width={10}>
          <Text
            color={focusedField === "language" ? "cyanBright" : "white"}
            bold
          >
            Language:
          </Text>
        </Box>
        <Text
          color={focusedField === "language" ? "cyanBright" : "gray"}
          bold={focusedField === "language"}
        >
          {focusedField === "language" ? `> ${languageLabel}` : languageLabel}
        </Text>
        {focusedField === "language" && (
          <Text dimColor>{"  "}(Enter to select)</Text>
        )}
      </Box>
      <Box>
        <Text color="green">
          {focusedField === "language"
            ? "Press Enter to select language"
            : "Press Enter to search"}
        </Text>
      </Box>
    </Box>
  );
};

export default SearchForm;
