import { Text } from "ink";
import type { FC } from "react";
import { useI18n } from "../../i18n/I18nProvider.tsx";

export type Mode =
  | "form"
  | "results"
  | "language"
  | "localeSetup"
  | "settings"
  | "settingsLocale"
  | "normalize";

export const HelpRow: FC<{ mode: Mode; canDownload?: boolean }> = ({
  mode,
  canDownload = true,
}) => {
  const { t } = useI18n();

  let tip = t("help.form");
  if (mode === "language" || mode === "settingsLocale") {
    tip = t("help.language");
  } else if (mode === "localeSetup") {
    tip = t("help.localeSetup");
  } else if (mode === "settings") {
    tip = t("help.settings");
  } else if (mode === "normalize") {
    tip = t("help.normalize");
  } else if (mode === "results") {
    tip = canDownload ? t("help.results") : t("help.resultsNoDownload");
  }

  return (
    <Text>
      <Text color="white" bold>
        {t("help.tips")}
      </Text>{" "}
      <Text dimColor>{tip}</Text>
    </Text>
  );
};

export default HelpRow;
