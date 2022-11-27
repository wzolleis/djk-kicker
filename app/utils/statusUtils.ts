import type { statusInConfigKey } from "~/components/i18n/config";
import { config } from "~/components/i18n/config";
import messages from "~/components/i18n/messages";

export function parseStatus(statusNumber: number) {
  const statusString: string = config.status[statusNumber];

  return messages.game.feedback.status.translations[
    statusString as statusInConfigKey
  ]
    ? messages.game.feedback.status.translations[
        statusString as statusInConfigKey
      ]
    : messages.game.feedback.status.translations.unknown;
}
