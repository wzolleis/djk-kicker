import Counter from "~/components/common/counter/Counter";
import messages from "~/components/i18n/messages";
import {calculateNumberOfPlayerWithStatus} from "~/utils/playerCountHelper";
import {statusInConfig} from "~/config/status";
import {GameWithFeedback} from "~/config/gameTypes";

type DeclinedPlayersCounterProps = {
    game: GameWithFeedback;
};

const DeclinedPlayersCounter = ({game}: DeclinedPlayersCounterProps) => {
    let counter = calculateNumberOfPlayerWithStatus(game, statusInConfig.declined)

    return (
        <>
            <div className={"flex flex-col items-center px-3 py-2"}>
                <p className={"text-label-medium text-gray-500 font-default-medium"}>{messages.game.count.declinedPlayers}</p>
                <Counter color={"text-red-500"} value={counter}/>
            </div>
        </>
    );
};

export default DeclinedPlayersCounter;