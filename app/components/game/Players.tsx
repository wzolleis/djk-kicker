import messages from "~/components/i18n/messages";
import type { GameWithFeedback } from "~/routes/games/$gameId";
import PlayerCard from "~/components/game/players/PlayerCard";


interface PlayerProps {
  game: GameWithFeedback;
}


const Players = ({ game }: PlayerProps) => {
  return (
    <section className={""}>
      <div className={"flex items-center gap-3"}>
        <p className={"text-gray-600 font-inter-regular text-subheading px-2 "}>{messages.game.players.title}</p>
        <div>
          <button
            className={"font-inter-regular text-item-caption bg-indigo-500 text-white rounded-lg py-2 px-3"}>{messages.game.players.add}</button>
        </div>
      </div>

      <main className={"flex flex-col gap-3 mt-3"}>
        {
          game.feedback.map((feedback) => (
            <PlayerCard key={feedback.id} player={feedback.player} feedback={feedback}></PlayerCard>
          ))
        }
      </main>
    </section>


  );

};
export default Players;