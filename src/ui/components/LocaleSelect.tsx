import { Box, Text } from "ink";
import type { FC } from "react";
import { useI18n } from "../../i18n/I18nProvider.tsx";
import { APP_LOCALES, type AppLocaleCode } from "../../i18n/locales.ts";
import Select from "./Select.tsx";

export type LocaleSelectProps = {
  value: AppLocaleCode;
  onChange: (value: AppLocaleCode) => void;
  titleKey?: "language.selectAppLanguage" | "localeSetup.subtitle";
  showWelcome?: boolean;
};

export const LocaleSelect: FC<LocaleSelectProps> = ({
  value,
  onChange,
  titleKey = "language.selectAppLanguage",
  showWelcome = false,
}) => {
  const { t } = useI18n();

  const options = APP_LOCALES.map((locale) => ({
    label: `${locale.nativeLabel}  (${locale.code})`,
    value: locale.code,
  }));

  return (
    <Box flexDirection="column" gap={1}>
      {showWelcome && (
        <Text color="cyanBright" bold>
          {t("localeSetup.title")}
        </Text>
      )}
      <Text color="white" bold>
        {t(titleKey)}
      </Text>
      <Select
        options={options}
        value={value}
        onChange={(v) => onChange(v as AppLocaleCode)}
        visibleOptionCount={12}
      />
    </Box>
  );
};

export default LocaleSelect;
