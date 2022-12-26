import Counter from "~/components/common/counter/Counter";
import messages from "~/components/i18n/messages";
import {configuration} from "~/config";
import {GameWithFeedback} from "~/config/gameTypes";

type UndecidedPlayerProps = {
    game: GameWithFeedback;
};

const UndecidedPlayersCounter = ({game}: UndecidedPlayerProps) => {
    let undecidedPlayerCounter = 0;
    game.feedback.map((feedback) => {
        if (feedback.status === configuration.status.undecided) {
            undecidedPlayerCounter++;
        }
    });

    return (
        <>
            <div className={"flex flex-col items-center px-3 py-2"}>
                <p className={"text-label-medium text-gray-500 font-default-medium"}>{messages.game.count.undecidedPlayers}</p>
                <Counter color={"text-yellow-500"} value={undecidedPlayerCounter}/>
            </div>
        </>
    );
};

export default UndecidedPlayersCounter;