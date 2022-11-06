import type {Game} from "@prisma/client";
import GameCard from "~/components/game/GameCard";

type GameProps = {
    games: Game[],
}


const Games = ({games}: GameProps) => {
    return (
        <>
            <main className={"flex flex-col gap-3 transition-opacity ease-in-out delay-150"}>
                {games.map((game: Game) => (
                    <GameCard game={game} key={game.id}></GameCard>
                ))}
            </main>
        </>
    )

}

export default Games