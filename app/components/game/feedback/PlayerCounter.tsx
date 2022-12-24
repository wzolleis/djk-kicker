import {GameWithFeedback} from "~/routes/application/games/$gameId";
import Counter from "~/components/common/counter/Counter";

type PlayerCounterProps = {
    game: GameWithFeedback;
    calculate: (game: GameWithFeedback) => number
    title: string

    counterColor?: string
};

const PlayerCounter = ({game, title, calculate, counterColor}: PlayerCounterProps) => {
    const counter = calculate(game)
    const color = counterColor ?? "text-green-500"
    return (
        <>
            <div className={"flex flex-col items-center px-3 py-2"}>
                <p className={"text-label-medium text-gray-500 font-default-medium"}>{title}</p>
                <Counter color={color} value={counter}/>
            </div>
        </>
    );
};

export default PlayerCounter;