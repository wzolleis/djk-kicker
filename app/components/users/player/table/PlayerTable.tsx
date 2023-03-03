import messages from "~/components/i18n/messages";
import {Player} from "@prisma/client";
import PlayerTableRow from "~/components/users/player/table/PlayerTableRow";

export type PlayerTableProps = {
    players: Player[];
}


const PlayerTable = ({players}: PlayerTableProps) => {


    return (
        <>
            <div className={"bg-white rounded-xl shadow shadow-lg shadow-indigo-200 px-5"}>
                <table className="table-auto w-full ">
                    <thead className={"mb-4"}>
                    <tr className={"border-b text-left"}>
                        <th className={"py-3"}>{messages.adminOverviewTable.name}</th>
                        <th>{messages.adminOverviewTable.email}</th>
                        <th>{messages.adminOverviewTable.playerId}</th>
                    </tr>
                    </thead>
                    <tbody className={"mt-5"}>
                    {players.map((player: Player) => (
                        <tr className={"border-b"} key={player.id}>
                            <PlayerTableRow player={player}/>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </>
    )

}

export default PlayerTable;