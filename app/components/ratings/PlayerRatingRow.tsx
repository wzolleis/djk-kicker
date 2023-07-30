import {PlayerRating} from "@prisma/client";

type PlayerRatingRowProps = {
    playerRating: PlayerRating
}

const PlayerRatingRow = ({playerRating}: PlayerRatingRowProps) => {
    const {overall, technik, speed, condition, playerName} = playerRating
    const values = `${overall} (${technik}/${speed}/${condition})`

    return (
        <>
            <td className={"py-5"}>{playerName}</td>
            <td className={"py-5 text-start"}>{values}</td>
        </>
    )
}

export default PlayerRatingRow