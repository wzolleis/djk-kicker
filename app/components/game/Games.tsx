import type {Game} from "@prisma/client";
import GameCard from "~/components/game/GameCard";
import {Link} from "@remix-run/react";
import DefaultArrowButton from "~/components/common/buttons/DefaultArrowButton";

type GameProps = {
    games: Game[],
}


const Games = ({games}: GameProps) => {
    return (
        <>
            <main
                className={"flex flex-col gap-3 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 transition-opacity ease-in-out delay-150"}>
                {games.map((game: Game) => (
                    <GameCard game={game} key={game.id}>
                        <DefaultArrowButton url={game.id}/>
                    </GameCard>
                ))}
            </main>
        </>
    )

}

export default Games