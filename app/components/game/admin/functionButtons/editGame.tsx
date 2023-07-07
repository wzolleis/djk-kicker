import messages from "~/components/i18n/messages";
import {ButtonProps} from "~/components/game/admin/functionButtons/gameButtonTypes";
import GameActionButton from "~/components/game/admin/functionButtons/GameActionButton";

export const EditGameButton = ({intent}: ButtonProps) => {
    return (
        <GameActionButton intent={intent} label={messages.buttons.edit} icon={"fa-edit"}/>
    )
}
