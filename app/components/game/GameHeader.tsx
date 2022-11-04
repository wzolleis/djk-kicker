import type {Game} from "@prisma/client";
import {useDate} from "~/utils";


interface gameHeaderProps {
    game: Game;
}


const GameHeader = ({game}: gameHeaderProps) => {
    return (
        <div className={"flex flex-col w-full items-start"}>
            <p className={"rounded px-2 py-1 bg-indigo-200 text-indigo-700 font-poppins-regular text-label-medium"}>{useDate(game.gameTime!)}</p>
            <p className={"font-poppins-semibold text-headline-medium text-slate-800"}>{game.name}</p>
        </div>
    );
};
export default GameHeader;