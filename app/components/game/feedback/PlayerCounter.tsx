import Counter from "~/components/common/counter/Counter";
import {GameWithFeedback} from "~/config/gameTypes";
import classNames from "classnames";

type PlayerCounterProps = {
    game: GameWithFeedback;
    calculate: (game: GameWithFeedback) => number
    title: string
    counterColor?: string

    className?: string
};

const PlayerCounter = ({game, title, calculate, counterColor, className}: PlayerCounterProps) => {
    const counter = calculate(game)
    const color = counterColor ?? "text-green-500"
    return (
        <div className={classNames(className, "flex flex-col items-center px-3 py-2")}>
            <p className={"text-label-medium text-gray-500 font-default-medium"}>{title}</p>
            <Counter color={color} value={counter}/>
        </div>
    );
};

export default PlayerCounter;