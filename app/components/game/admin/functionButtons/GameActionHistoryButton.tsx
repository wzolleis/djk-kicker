import messages from "~/components/i18n/messages";
import {ButtonProps} from "~/components/game/admin/functionButtons/gameButtonTypes";
import GameActionButton from "~/components/game/admin/functionButtons/GameActionButton";

export const GameActionHistoryButton = ({gameId, intent}: ButtonProps) => {
    return (
        <GameActionButton intent={intent} label={messages.buttons.actionHistory} icon={"fa-solid fa-timeline"}/>
    )
}
