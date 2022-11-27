import type {Player, Feedback} from "@prisma/client";
import messages from "~/components/i18n/messages";
import {Link} from "@remix-run/react";
import {PlayerWithFeedback} from "~/models/player.server";
import PlayerStatusTag from "~/components/common/tags/PlayerStatusTag";

interface PlayerCardProps {
    player: PlayerWithFeedback;
}

const PlayerCard = ({player}: PlayerCardProps) => {
    return (
        <main
            className={
                "grid grid-cols-6 gap-3 rounded-xl bg-white py-3 px-5  ring ring-1 ring-indigo-100"
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
                        <PlayerStatusTag status={player.feedback.status!}></PlayerStatusTag>
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
                <div className={"rounded-full p-3 ring ring-1 ring-indigo-100"}>
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
