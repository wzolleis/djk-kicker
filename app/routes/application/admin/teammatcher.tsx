import {json, LoaderFunction} from "@remix-run/node";
import {useLoaderData} from "@remix-run/react";
import {getAllRatings} from "~/models/playerRating.server";
import {PlayerRating} from "@prisma/client";
import PlayerRatingTable from "~/components/ratings/PlayerRatingTable";

type LoaderData = {
    ratings: PlayerRating[]
}

export const loader: LoaderFunction = async () => {
    const ratings = await getAllRatings()
    return json({ratings})
};


const Teammatcher = () => {
    const data = useLoaderData() as unknown as LoaderData
    return (
        <div>
            <PlayerRatingTable ratings={data.ratings}/>
        </div>
    )
}

export default Teammatcher