import {PlayerWithFeedback} from "~/models/player.server";
import PlayerStatusTag from "~/components/common/tags/PlayerStatusTag";
import {statusInConfig} from "~/config/status";

interface PlayerCardProps {
    player: PlayerWithFeedback;
}

const PlayerCard = ({player}: PlayerCardProps) => {
    return (
        <main
            className={
                "grid grid-cols-6 gap-3 rounded-xl bg-white py-3 px-5  ring ring-1 ring-indigo-100"
            }>
            <div className={"col-span-5 flex flex-col justify-start py-1"}>
                <div className={"flex items-center gap-2"}>
                    <p className={"font-default-semibold text-label-large text-darkblue"}>
                        {player.name}
                    </p>
                    <PlayerStatusTag
                        status={player.feedback.status}></PlayerStatusTag>
                </div>
                {player.feedback.status === statusInConfig.confirmed &&
                    <p className={"text-label-medium text-gray-500 mt-2"}>
                        Gäste: {player.feedback.playerCount}
                    </p>
                }
                <p className={"text-label-medium text-gray-500 mt-2"}>
                    {player.feedback.note}
                </p>
            </div>
        </main>
    );
};

export default PlayerCard;
