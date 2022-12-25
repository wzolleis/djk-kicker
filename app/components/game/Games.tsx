import type { Game } from "@prisma/client";
import GameCard from "~/components/game/GameCard";
import { Link } from "@remix-run/react";
import DefaultArrowButton from "~/components/common/buttons/DefaultArrowButton";

type GameProps = {
    games: Game[];
};

const Games = ({ games }: GameProps) => {
    return (
        <>
            <main
                className={
                    "flex flex-col gap-3 transition-opacity delay-150 ease-in-out md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                }>
                {games.map((game: Game) => (
                    <GameCard game={game} key={game.id}>
                        <DefaultArrowButton
                            url={game.id}
                            onClick={() => void 0}
                        />
                    </GameCard>
                ))}
            </main>
        </>
    );
};

export default Games;
