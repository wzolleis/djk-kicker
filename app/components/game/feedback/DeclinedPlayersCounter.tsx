import {GameWithFeedback} from "~/routes/application/games/$gameId";
import Counter from "~/components/common/counter/Counter";
import messages from "~/components/i18n/messages";
import {configuration} from "~/config";

type DeclinedPlayersCounterProps = {
    game: GameWithFeedback;
};

const DeclinedPlayersCounter = ({game}: DeclinedPlayersCounterProps) => {
    let declinedPlayerCount = 0;
    game.feedback.map((feedback) => {
        if (feedback.status === configuration.status.declined) {
            declinedPlayerCount++;
        }
    });

    return (
        <>
            <div className={"flex flex-col items-center px-3 py-2"}>
                <p className={"text-label-medium text-gray-500 font-poppins-medium"}>{messages.game.count.declinedPlayers}</p>
                <Counter color={"text-red-500"} value={declinedPlayerCount}/>
            </div>
        </>
    );
};

export default DeclinedPlayersCounter;