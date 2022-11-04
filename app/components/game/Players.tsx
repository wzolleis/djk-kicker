import messages from "~/components/i18n/messages";
import PlayerCard from "~/components/game/players/PlayerCard";
import {Link} from "@remix-run/react";
import type {GameWithFeedback} from "~/routes/games/$gameId";


interface PlayerProps {
    game: GameWithFeedback;
}


const Players = ({game}: PlayerProps) => {
    return (
        <section className={""}>
            <div className={"bg-white rounded-xl py-3 px-2"}>
                <div className={"flex items-center gap-3 justify-between px-4"}>
                    <div className={"flex items-center gap-3"}>
                        <span className={"bg-indigo-200 rounded w-4 h-8"}></span>
                        <p className={"font-poppins-semibold text-title-large "}>{messages.game.players.title}</p></div>
                    <Link to={"player/create"}
                          className={"font-poppins-regular text-label-medium text-white rounded-lg py-3 px-5 bg-indigo-500 "}>{messages.game.players.add}</Link>
                </div>

                <main className={"flex flex-col gap-3 mt-5"}>
                    {
                        game.feedback.map((feedback: GameWithFeedback) => (
                            <PlayerCard key={feedback.id} player={feedback.player} feedback={feedback}></PlayerCard>
                        ))
                    }
                </main>
            </div>
        </section>


    );

};
export default Players;