import type {Player, Feedback} from "@prisma/client";
import messages from "~/components/i18n/messages";
import {Link} from "@remix-run/react";
import {useDate} from "~/utils";


interface PlayerCardProps {
    player: Player;
    feedback: Feedback;
}

const PlayerCard = ({player, feedback}: PlayerCardProps) => {

    return (
    <main
        className={"rounded-xl gap-3 grid grid-cols-6 bg-white ring ring-1 ring-indigo-100 py-3 px-5 shadow-lg shadow-indigo-500/20"}>
        <div className={"col-span-5 flex flex-col justify-start"}>

            <div className={"flex flex-col py-1"}>
                <div className={"flex gap-2 items-center"}>
                    <p className={"font-poppins-semibold text-label-large text-darkblue"}>
                        {player.name}
                    </p>
                    <div
                        className={`font-inter-light text-tag rounded-lg ring ring-1 py-1 px-3 text-item-caption truncate ${feedback.status === null ? "bg-gray-200" : feedback.status ? "bg-white text-green-700 shadow-xl shadow-inner shadow-green-500/50 ring-green-200" : "bg-white shadow-xl shadow-inner shadow-red-500/50 text-red-700 ring-red-200"}`}>
                        {feedback.status === null ? messages.game.players.status.undefined : feedback.status ? messages.game.players.status.confirmed : messages.game.players.status.declined}
                    </div>
                </div>
                <p className={"text-gray-500 text-label-medium"}>{feedback.note}</p>
            </div>


        </div>
        <Link className={"flex justify-center items-center"} to={`player/${player.id}`}>
            <div className={"rounded-full bg-blue-500/20 p-3"}>
                <img src="/img/arrow.png" className={"h-4 w-4 rounded-full"} alt=""/></div>
        </Link>
    </main>


)
    ;

};


export default PlayerCard;