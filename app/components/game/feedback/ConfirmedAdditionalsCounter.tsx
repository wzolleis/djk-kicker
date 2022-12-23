import {GameWithFeedback} from "~/routes/application/games/$gameId";
import Counter from "~/components/common/counter/Counter";
import messages from "~/components/i18n/messages";
import {configuration} from "~/config";

type AdditionalPlayersCounterProps = {
    game: GameWithFeedback;
};

const AdditionalPlayersCounter = ({game}: AdditionalPlayersCounterProps) => {
    let additionalPlayerCount = 0;
    game.feedback.map((feedback) => {
        if (feedback.status === configuration.status.confirmed) {
            additionalPlayerCount = additionalPlayerCount + feedback.playerCount
        }
    });

    return (
        <>
            <div className={"flex flex-col items-center px-3 py-2"}>
                <p className={"text-label-medium text-gray-500 font-default-medium"}>{messages.game.count.additionalPlayers}</p>
                <Counter color={"text-green-500"} value={additionalPlayerCount}/>
            </div>
        </>
    );
};

export default AdditionalPlayersCounter;