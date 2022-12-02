import {Game} from "@prisma/client";
import GameCard from "~/components/game/GameCard";
import {Link} from "@remix-run/react";
import DefaultButton from "~/components/common/buttons/DefaultButton";

type GamesListProps = {
    games: Game[];
}


const GamesList = ({games}: GamesListProps) => {

    return (
        <>
            <section className={"flex flex-col gap-2"}>
                {games.map((game) => (
                    <GameCard key={game.id} game={game}>
                            <Link className={"bg-indigo-600 text-white p-3 rounded font-poppins-medium"} to={`${game.id}`}>
                                Bearbeiten
                            </Link>
                    </GameCard>
                ))}
            </section>
        </>
    )
}

export default GamesList;