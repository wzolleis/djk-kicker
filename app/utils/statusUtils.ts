import messages from "~/components/i18n/messages";
import {statusInConfigKey} from "~/config/status";
import {configuration} from "~/config";

export function parseStatus(statusNumber: number) {
  const statusString: string = configuration.status[statusNumber];

  return messages.game.feedback.status.translations[
    statusString as statusInConfigKey
  ]
    ? messages.game.feedback.status.translations[
        statusString as statusInConfigKey
      ]
    : messages.game.feedback.status.translations.unknown;
}
