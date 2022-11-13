import {Link} from "@remix-run/react";
import type {Game} from "@prisma/client";
import {useDate} from "~/utils";

type GameCardProps = {
    game: Game;
};

const GameCard = ({game}: GameCardProps) => {
    return (
        <main
            className={"rounded-xl gap-3 grid grid-cols-6 bg-white ring ring-1 ring-indigo-100 py-3 px-5 shadow-lg shadow-indigo-500/20"}>
            <div className={"col-span-5 flex flex-col justify-start"}>

                    <div className={"flex flex-col py-1"}>
                        <p className={"font-poppins-semibold text-label-large text-darkblue"}>
                            {game.name}
                        </p>
                        <p className={"text-gray-500 text-label-medium"}>{useDate(game.gameTime)}</p>
                    </div>


            </div>
            <Link className={"flex justify-end items-center"} to={`${game.id}`}>
                <div className={"p-3 shadow-lg shadow-indigo-500/40 rounded-full"}>
                    <img src="/img/arrow-indigo.png" className={"h-4 w-4 rounded-full "} alt=""/></div>
            </Link>
        </main>
    );
};
export default GameCard;
