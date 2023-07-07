import {ButtonProps} from "~/components/game/admin/functionButtons/gameButtonTypes";
import messages from "~/components/i18n/messages";
import GameActionButton from "~/components/game/admin/functionButtons/GameActionButton";

export const GameFeedbackButton = ({intent}: ButtonProps) => {
    return (
        <GameActionButton intent={intent} label={messages.buttons.feedback} icon={"fa-comment"}/>
    )
}
