import type { Player, Feedback } from "@prisma/client";
import messages from "~/components/i18n/messages";
import { Link } from "@remix-run/react";
import { PlayerWithFeedback } from "~/models/player.server";

interface PlayerCardProps {
  player: PlayerWithFeedback;
}

const PlayerCard = ({ player }: PlayerCardProps) => {
  return (
    <main
      className={
        "grid grid-cols-6 gap-3 rounded-xl bg-white py-3 px-5 shadow-lg shadow-indigo-500/20 ring ring-1 ring-indigo-100"
      }
    >
      <div className={"col-span-5 flex flex-col justify-start"}>
        <div className={"flex flex-col py-1"}>
          <div className={"flex items-center gap-2"}>
            <p
              className={"font-poppins-semibold text-label-large text-darkblue"}
            >
              {player.name}
            </p>
            <div
              className={`rounded-lg py-1 px-3 font-poppins-regular text-label-medium ${
                player.feedback.status === null
                  ? "bg-white text-slate-700 shadow-xl shadow-inner shadow-slate-500/40 ring-slate-200"
                  : player.feedback.status
                  ? "bg-green-500 text-white shadow-lg shadow-green-500/50"
                  : "bg-red-500 text-white shadow-lg shadow-red-500/50"
              }`}
            >
              {player.feedback.status === null
                ? messages.game.players.status.undefined
                : player.feedback.status
                ? messages.game.players.status.confirmed
                : messages.game.players.status.declined}
            </div>
          </div>
          <p className={"text-label-medium text-gray-500"}>
            {player.feedback.note}
          </p>
        </div>
      </div>
      <Link
        className={"flex items-center justify-end"}
        to={`player/${player.id}`}
      >
        <div className={"rounded-full p-3 shadow-lg shadow-indigo-500/40"}>
          <img
            src="/img/arrow-indigo.png"
            className={"h-4 w-4 rounded-full "}
            alt=""
          />
        </div>
      </Link>
    </main>
  );
};

export default PlayerCard;
