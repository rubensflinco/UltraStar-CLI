import { Box, Text } from "ink";
import type { FC } from "react";
import { useI18n } from "../../i18n/I18nProvider.tsx";
import { getLocaleMeta } from "../../i18n/locales.ts";

export const SettingsScreen: FC = () => {
  const { t, locale } = useI18n();
  const meta = getLocaleMeta(locale);

  return (
    <Box flexDirection="column" gap={1}>
      <Text color="cyanBright" bold>
        {t("settings.title")}
      </Text>
      <Box>
        <Box width={18}>
          <Text color="white" bold>
            {t("settings.appLanguage")}
          </Text>
        </Box>
        <Text color="magentaBright">
          {meta.nativeLabel} ({meta.code})
        </Text>
      </Box>
      <Text color="green">{t("settings.changeHint")}</Text>
      <Text dimColor>{t("settings.backHint")}</Text>
    </Box>
  );
};

export default SettingsScreen;
