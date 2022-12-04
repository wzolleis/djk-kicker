import type {Game} from "@prisma/client";
import {getNextGameDay} from "~/utils";
import type {ReactNode} from "react";
import SmallTag from "~/components/common/tags/SmallTag";
import messages from "~/components/i18n/messages";
import dateUtils from "~/dateUtils";
import {DateTime} from "luxon";

type GameCardProps = {
    game: Game;
    children: ReactNode
};

const GameCard = ({game, children}: GameCardProps) => {
    const nextGameDate = getNextGameDay()
    const gameTime = DateTime.fromJSDate(new Date(game.gameTime))
    const isFutureGame = gameTime >= nextGameDate

    return (
        <main
            className={`rounded-xl gap-3 ring ring-1 ring-indigo-100 py-3 px-5 flex justify-between items-center` }>
            <div className={"col-span-5 flex flex-col justify-start"}>
                <div className={"flex flex-col py-1"}>
                    <p className={`font-default-bold text-title-medium ${isFutureGame ? 'text-darkblue' : 'text-red-200'}`}>
                        {`${game.name} ${messages.commonForm.gameOverCommentOrNothing(!isFutureGame)}`}
                    </p>
                    <div className={"flex flex-col items-start"}>
                        <p className={`font-default-light text-label-medium ${isFutureGame ? 'text-gray-500' : 'text-red-200'}`}>
                            {`${dateUtils.dateTimeToFormat({value: gameTime})}`}
                        </p>
                        <SmallTag text={messages.commonForm.spielort(game.spielort)}></SmallTag>
                    </div>
                </div>

            </div>
            {children}
        </main>
    );
};
export default GameCard;
