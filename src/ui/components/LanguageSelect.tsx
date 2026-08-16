import { Box, Text } from "ink";
import type { FC } from "react";
import {
  formatLanguageLabel,
  USDB_LANGUAGES,
} from "../../api/usdb/languages.ts";
import Select from "./Select.tsx";

export type LanguageSelectProps = {
  value: string;
  onChange: (value: string) => void;
};

export const LanguageSelect: FC<LanguageSelectProps> = ({
  value,
  onChange,
}) => {
  const options = [
    { label: "Any", value: "" },
    ...USDB_LANGUAGES.map((lang) => ({
      label: formatLanguageLabel(lang),
      value: lang,
    })),
  ];

  return (
    <Box flexDirection="column" gap={1}>
      <Text color="white" bold>
        Select language
      </Text>
      <Select
        options={options}
        value={value}
        onChange={onChange}
        visibleOptionCount={15}
      />
    </Box>
  );
};

export default LanguageSelect;
