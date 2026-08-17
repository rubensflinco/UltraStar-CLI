import { Box, Text } from "ink";
import TextInput from "ink-text-input";
import type { FC } from "react";
import { useI18n } from "../../i18n/I18nProvider.tsx";
import { getLocaleMeta } from "../../i18n/locales.ts";
import {
  MAX_TARGET_PEAK_DB,
  MIN_TARGET_PEAK_DB,
} from "../../storage/config.ts";

export type SettingsFocusedField = "locale" | "targetPeakDb";

export type SettingsScreenProps = {
  focusedField: SettingsFocusedField;
  targetPeakDbDraft: string;
  onTargetPeakDbDraftChange: (value: string) => void;
};

export const SettingsScreen: FC<SettingsScreenProps> = ({
  focusedField,
  targetPeakDbDraft,
  onTargetPeakDbDraftChange,
}) => {
  const { t, locale } = useI18n();
  const meta = getLocaleMeta(locale);
  const localeFocused = focusedField === "locale";
  const peakFocused = focusedField === "targetPeakDb";

  return (
    <Box flexDirection="column" gap={1}>
      <Text color="cyanBright" bold>
        {t("settings.title")}
      </Text>

      <Box>
        <Box width={22}>
          <Text color={localeFocused ? "cyanBright" : "white"} bold>
            {localeFocused
              ? `> ${t("settings.appLanguage")}`
              : t("settings.appLanguage")}
          </Text>
        </Box>
        <Text color="magentaBright">
          {meta.nativeLabel} ({meta.code})
        </Text>
        {localeFocused && (
          <Text dimColor>
            {"  "}
            {t("form.enterToSelect")}
          </Text>
        )}
      </Box>

      <Box>
        <Box width={22}>
          <Text color={peakFocused ? "cyanBright" : "white"} bold>
            {peakFocused
              ? `> ${t("settings.targetPeakDb")}`
              : t("settings.targetPeakDb")}
          </Text>
        </Box>
        {peakFocused ? (
          <TextInput
            value={targetPeakDbDraft}
            onChange={onTargetPeakDbDraftChange}
            focus
            placeholder={t("settings.targetPeakDbPlaceholder")}
          />
        ) : (
          <Text color="yellowBright">{targetPeakDbDraft} dB</Text>
        )}
      </Box>

      <Text dimColor>
        {t("settings.targetPeakDbHint", {
          min: MIN_TARGET_PEAK_DB,
          max: MAX_TARGET_PEAK_DB,
        })}
      </Text>

      {localeFocused ? (
        <Text color="green">{t("settings.changeLanguageHint")}</Text>
      ) : (
        <Text color="green">{t("settings.editPeakHint")}</Text>
      )}
      <Text dimColor>{t("settings.backHint")}</Text>
    </Box>
  );
};

export default SettingsScreen;
