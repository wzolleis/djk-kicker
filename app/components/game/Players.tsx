import messages from "~/components/i18n/messages";
import PlayerCard from "~/components/game/players/PlayerCard";
import {Link} from "@remix-run/react";
// @ts-ignore
import MainPageContent from "~/components/common/MainPageContent";
import SmallButton from "~/components/common/buttons/SmallButton";
import type {FeedBackWithPlayer} from "~/routes/application/games/$gameId";
import {PlayerWithFeedback} from "~/models/player.server";


interface PlayerProps {
    players: PlayerWithFeedback[];
    gameId: string
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
                <main className={"flex flex-col gap-3 mt-5"}>
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