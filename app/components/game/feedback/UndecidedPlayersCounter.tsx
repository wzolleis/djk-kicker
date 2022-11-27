import {GameWithFeedback} from "~/routes/application/games/$gameId";
import Counter from "~/components/common/counter/Counter";
import {config} from "~/components/i18n/config";
import messages from "~/components/i18n/messages";

type UndecidedPlayerProps = {
    game: GameWithFeedback;
};

const UndecidedPlayersCounter = ({game}: UndecidedPlayerProps) => {
    let undecidedPlayerCounter = 0;
    game.feedback.map((feedback) => {
        if (feedback.status === config.status.undecided) {
            undecidedPlayerCounter++;
        }
    });

    return (
        <>
            <div className={"flex flex-col items-center px-3 py-2"}>
                <p className={"text-label-medium text-gray-500 font-poppins-medium"}>{messages.game.count.undecidedPlayers}</p>
                <Counter color={"text-yellow-500"} value={undecidedPlayerCounter}/>
            </div>
        </>
    );
};

export default UndecidedPlayersCounter;