import PlayerCard from "~/components/game/players/PlayerCard";
import MainPageContent from "~/components/common/MainPageContent";
import type {PlayerWithFeedback} from "~/models/player.server";

interface PlayerProps {
    players: PlayerWithFeedback[];
}

const Players = ({players}: PlayerProps) => {
    return (
        <MainPageContent>
            <header className={"flex items-center justify-between"}>
                <p className={"font-default-medium text-headline-small text-darkblue"}>Spieler</p>
            </header>
            <main className={"mt-5 flex flex-col gap-3 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"}>
                {players?.map((player: PlayerWithFeedback) => (
                    <PlayerCard key={player.id} player={player}></PlayerCard>
                ))}
            </main>
        </MainPageContent>
    );
};
export default Players;
