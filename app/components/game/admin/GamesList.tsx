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
                        <DefaultButton>
                            <img className={"h-6"} src={"/img/icons/pencil-line.png"} alt={"edit"}/>
                            <Link
                                  to={`${game.id}/edit`}>
                                Bearbeiten
                            </Link>
                        </DefaultButton>
                    </GameCard>
                ))}
            </section>
        </>
    )
}

export default GamesList;