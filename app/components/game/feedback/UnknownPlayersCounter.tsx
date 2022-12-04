import {GameWithFeedback} from "~/routes/application/games/$gameId";
import Counter from "~/components/common/counter/Counter";
import messages from "~/components/i18n/messages";
import {configuration} from "~/config";

type UnknownPlayersCounterProps = {
    game: GameWithFeedback;
};

const UnknownPlayersCounter = ({game}: UnknownPlayersCounterProps) => {
    let unknownPlayerCounter = 0;
    game.feedback.map((feedback) => {
        if (feedback.status === configuration.status.unknown) {
            unknownPlayerCounter++;
        }
    });

    return (
        <>
            <div className={"flex flex-col items-center px-3 py-2"}>
                <p className={"text-label-medium text-gray-500 font-poppins-medium"}>{messages.game.count.unknownPlayers}</p>
                <Counter color={"text-gray-500"} value={unknownPlayerCounter}/>
            </div>
        </>
    );
};

export default UnknownPlayersCounter;