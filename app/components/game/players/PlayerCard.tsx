import type { Player, Feedback } from "@prisma/client";
import messages from "~/components/i18n/messages";
import { Link } from "@remix-run/react";


interface PlayerCardProps {
  player: Player;
  feedback: Feedback;
}

const PlayerCard = ({ player, feedback }: PlayerCardProps) => {

  function onClick() {

  }

  return (
    <section className={"rounded-xl bg-slate-100/50"}>
      <main className={"grid grid-cols-6 p-5 gap-3"}>
        <div className={"col-span-5 flex flex-col gap-2"}>
          <div className={"flex gap-2 items-center"}>
            <p className={"text-darkblue font-poppins-semibold text-item-heading"}>{player.name}</p>
            <div
              className={`font-inter-light text-tag rounded-full py-1 px-3 text-item-caption truncate ${feedback.status === null ? "bg-gray-200" : feedback.status ? "bg-green-200 text-green-700" : "bg-red-200 text-red-700"}`}>
              {feedback.status === null ? messages.game.players.status.undefined : feedback.status ? messages.game.players.status.confirmed : messages.game.players.status.declined}

            </div>
          </div>
          <p className={"text-gray-800 font-inter-light text-item-caption break-words"}>{feedback.note}</p>
        </div>
        <Link className={"flex justify-center items-center"} to={`player/${player.id}`}>
          <div className={"rounded-full bg-blue-500/20 p-3"}>
            <img src="/img/arrow.png" className={"h-4 w-4 rounded-full"} alt="" /></div>
        </Link>
      </main>


    </section>


  );

};


export default PlayerCard;