import {PlayerRating} from "@prisma/client";

type PlayerRatingRowProps = {
    playerRating: PlayerRating
}

const PlayerRatingRow = ({playerRating}: PlayerRatingRowProps) => {
    return (
        <>
            <td className={"py-5"}>{playerRating.playerName}</td>
            <td className={"py-5"}>{playerRating.overall}</td>
        </>
    )
}

export default PlayerRatingRow