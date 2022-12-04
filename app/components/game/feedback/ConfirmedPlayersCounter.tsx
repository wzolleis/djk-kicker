import {GameWithFeedback} from "~/routes/application/games/$gameId";
import Counter from "~/components/common/counter/Counter";
import messages from "~/components/i18n/messages";
import {configuration} from "~/config";

type ConfirmedPlayersCounterProps = {
    game: GameWithFeedback;
};

const ConfirmedPlayersCounter = ({game}: ConfirmedPlayersCounterProps) => {
    let confirmedPlayerCount = 0;
    game.feedback.map((feedback) => {
        if (feedback.status === configuration.status.confirmed) {
            confirmedPlayerCount++;
        }
    });

    return (
        <>
            <div className={"flex flex-col items-center px-3 py-2"}>
                <p className={"text-label-medium text-gray-500 font-poppins-medium"}>{messages.game.count.confirmedPlayers}</p>
                <Counter color={"text-green-500"} value={confirmedPlayerCount}/>
            </div>
        </>
    );
};

export default ConfirmedPlayersCounter;