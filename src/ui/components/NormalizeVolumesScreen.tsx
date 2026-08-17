import { Box, Text } from "ink";
import Spinner from "ink-spinner";
import type { FC } from "react";
import { useI18n } from "../../i18n/I18nProvider.tsx";

export type NormalizeProgressView = {
  current: number;
  total: number;
  dirName: string;
  percent: number;
};

export type NormalizeSummaryView = {
  succeeded: number;
  skipped: number;
  failed: number;
};

export type NormalizeVolumesScreenProps = {
  isRunning: boolean;
  progress: NormalizeProgressView | null;
  summary: NormalizeSummaryView | null;
  targetPeakDb: number;
};

export const NormalizeVolumesScreen: FC<NormalizeVolumesScreenProps> = ({
  isRunning,
  progress,
  summary,
  targetPeakDb,
}) => {
  const { t } = useI18n();

  return (
    <Box flexDirection="column" gap={1}>
      <Text color="cyanBright" bold>
        {t("normalize.title")}
      </Text>
      <Text dimColor>
        {t("normalize.description", { peak: targetPeakDb })}
      </Text>

      {isRunning && (
        <Box flexDirection="column">
          <Text>
            <Text color="green">
              <Spinner type="dots" />
            </Text>{" "}
            <Text color="yellow">{t("normalize.running")}</Text>
          </Text>
          {progress && progress.total > 0 && (
            <Text>
              <Text color="white" bold>
                {progress.current}/{progress.total}
              </Text>
              {progress.dirName ? (
                <>
                  <Text color="gray"> — </Text>
                  <Text color="cyanBright">{progress.dirName}</Text>
                </>
              ) : null}
            </Text>
          )}
          {progress && progress.total === 0 && (
            <Text color="yellow">{t("normalize.noneFound")}</Text>
          )}
        </Box>
      )}

      {!isRunning && summary && (
        <Box flexDirection="column">
          <Text color="greenBright">{t("normalize.done")}</Text>
          <Text>
            <Text color="white" bold>
              {t("normalize.succeeded")}
            </Text>{" "}
            <Text color="greenBright">{summary.succeeded}</Text>
            <Text color="gray"> · </Text>
            <Text color="white" bold>
              {t("normalize.skipped")}
            </Text>{" "}
            <Text color="yellow">{summary.skipped}</Text>
            <Text color="gray"> · </Text>
            <Text color="white" bold>
              {t("normalize.failed")}
            </Text>{" "}
            <Text color="red">{summary.failed}</Text>
          </Text>
        </Box>
      )}

      {!isRunning && !summary && (
        <Text color="green">{t("normalize.pressEnter")}</Text>
      )}

      <Text dimColor>{t("normalize.backHint")}</Text>
    </Box>
  );
};

export default NormalizeVolumesScreen;
