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
                    <tr className={"border-b text-left py-5"}>
                        <th>{messages.adminOverviewTable.name}</th>
                        <th>{messages.adminOverviewTable.email}</th>
                        <th>{messages.adminOverviewTable.status}</th>
                        <th className={'hidden md:block py-5'}>{messages.adminOverviewTable.playerId}</th>
                        <th className={'py-5'}>{messages.adminOverviewTable.actions}</th>
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