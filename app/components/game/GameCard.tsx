import type {Game} from "@prisma/client";
import {useDate} from "~/utils";
import type {ReactNode} from "react";
import SmallTag from "~/components/common/tags/SmallTag";
import {config} from "~/components/i18n/config";

type GameCardProps = {
    game: Game;
    children: ReactNode
};

const GameCard = ({game, children}: GameCardProps) => {
    return (
        <main
            className={"rounded-xl gap-3 bg-white ring ring-1 ring-indigo-100 py-3 px-5 flex justify-between items-center"}>
            <div className={"col-span-5 flex flex-col justify-start"}>

                <div className={"flex flex-col py-1"}>
                    <p className={"font-default-bold text-title-medium text-darkblue"}>
                        {game.name}
                    </p>
                    <div className={"flex flex-col items-start"}>
                        <p className={"text-gray-500 font-default-light  text-label-medium"}>{useDate(game.gameTime)}</p>
                        <SmallTag text={config.gameLocations[game.spielort as unknown as number]}></SmallTag>
                    </div>
                </div>

            </div>
            {children}
        </main>
    );
};
export default GameCard;
