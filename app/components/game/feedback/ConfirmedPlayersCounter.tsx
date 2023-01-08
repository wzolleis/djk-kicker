import Counter from "~/components/common/counter/Counter";
import messages from "~/components/i18n/messages";
import {calculateNumberOfPlayerWithStatus} from "~/utils/playerCountHelper";
import {statusInConfig} from "~/config/status";
import {GameWithFeedback} from "~/config/applicationTypes";

type ConfirmedPlayersCounterProps = {
    game: GameWithFeedback;
};

const ConfirmedPlayersCounter = ({game}: ConfirmedPlayersCounterProps) => {
   let counter = calculateNumberOfPlayerWithStatus(game, statusInConfig.confirmed)

    return (
        <>
            <div className={"flex flex-col items-center px-3 py-2"}>
                <p className={"text-label-medium text-gray-500 font-default-medium"}>{messages.game.count.confirmedPlayers}</p>
                <Counter color={"text-green-500"} value={counter}/>
            </div>
        </>
    );
};

export default ConfirmedPlayersCounter;