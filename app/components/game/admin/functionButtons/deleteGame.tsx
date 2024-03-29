import messages from "~/components/i18n/messages";
import {ButtonProps} from "~/components/game/admin/functionButtons/gameButtonTypes";
import GameActionButton from "~/components/game/admin/functionButtons/GameActionButton";


export const DeleteGameButton = ({intent}: ButtonProps) => {
    return (
        <GameActionButton intent={intent} label={messages.buttons.delete} icon={"fa-trash  text-red-500"}/>
    )
}
