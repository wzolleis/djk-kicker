import PlayerCard from "~/components/game/players/PlayerCard";
import MainPageContent from "~/components/common/MainPageContent";
import SmallButton from "~/components/common/buttons/SmallButton";
import type {PlayerWithFeedback} from "~/models/player.server";


interface PlayerProps {
    players: PlayerWithFeedback[];
    gameId: string,
}


const Players = ({players, gameId}: PlayerProps) => {
    return (
        <>
            <MainPageContent>
                <header className={"flex justify-between items-center"}>
                    <p className={"font-poppins-medium text-headline-small text-darkblue"}>Spieler</p>
                    <SmallButton title={"Spieler hinzufügen"}
                                 link={`/application/player/create?gameid=${gameId}`}></SmallButton>
                </header>
                <main className={"flex flex-col gap-3 mt-5 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"}>
                    {
                        players.map((player: PlayerWithFeedback) => (
                            <PlayerCard key={player.id} player={player}></PlayerCard>
                        ))
                    }
                </main>
            </MainPageContent>
        </>

    )
        ;

};
export default Players;