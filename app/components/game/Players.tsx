import messages from "~/components/i18n/messages";
import PlayerCard from "~/components/game/players/PlayerCard";
import {Link} from "@remix-run/react";
// @ts-ignore
import type {GameWithFeedback} from "~/routes/games/$gameId";
import MainPageContent from "~/components/common/MainPageContent";


interface PlayerProps {
    game: GameWithFeedback;
}


const Players = ({game}: PlayerProps) => {
    return (
        <>
            {/*<Link to={"player/create"}*/}
            {/*      className={"font-poppins-regular text-label-medium text-white rounded-lg py-3 px-5 bg-indigo-500 "}>{messages.game.players.add}</Link>*/}
            <MainPageContent>
                <p className={"font-poppins-medium text-headline-small text-darkblue"}>Spieler</p>
                <main className={"flex flex-col gap-3 mt-5"}>
                    {
                        game.feedback.map((feedback: GameWithFeedback) => (
                            <PlayerCard key={feedback.id} player={feedback.player} feedback={feedback}></PlayerCard>
                        ))
                    }
                </main>
            </MainPageContent>
        </>

    )
        ;

};
export default Players;