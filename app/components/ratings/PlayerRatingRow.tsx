import {PlayerRating} from "@prisma/client";

type PlayerRatingRowProps = {
    playerRating: PlayerRating
}

const PlayerRatingRow = ({playerRating}: PlayerRatingRowProps) => {
    const {overall, playerName} = playerRating
    return (
        <>
            <td className={"py-5"}>{playerName}</td>
            <td className={"py-5 text-start"}>{overall}</td>
        </>
    )
}

export default PlayerRatingRow