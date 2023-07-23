import {PlayerRating} from "@prisma/client";
import messages from "~/components/i18n/messages";
import PlayerRatingRow from "~/components/ratings/PlayerRatingRow";

export type PlayerRatingTableProps = {
    ratings: PlayerRating[]
}

const PlayerRatingTable = ({ratings}: PlayerRatingTableProps) => {
    return (
        <>
            <div className={"bg-white rounded-xl shadow shadow-lg shadow-indigo-200 px-5"}>
                <table className="table-auto w-full ">
                    <thead className={"mb-4"}>
                    <tr className={"border-b text-left py-5"}>
                        <th>{messages.adminPlayerRatingTable.name}</th>
                        <th>{messages.adminPlayerRatingTable.overall}</th>
                        <th className={'py-5'}>{messages.adminOverviewTable.actions}</th>
                    </tr>
                    </thead>
                    <tbody className={"mt-5"}>
                    {ratings.map((rating: PlayerRating) => (
                        <tr className={"border-b"} key={rating.id}>
                            <PlayerRatingRow playerRating={rating}/>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default PlayerRatingTable