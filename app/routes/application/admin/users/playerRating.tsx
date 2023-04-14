import {json, LoaderFunction} from "@remix-run/node";
import {requireUserId} from "~/session.server";
import {getActiveAndInactivePlayers} from "~/models/player.server";
import {Player, PlayerRating} from "@prisma/client";
import {getAllRatings} from "~/models/playerRating.server";
import ContentContainer from "~/components/common/container/ContentContainer";
import {Form, useLoaderData} from "@remix-run/react";
import React from "react";
import is from "@sindresorhus/is";
import undefined = is.undefined;


type PlayerWithRating = {
    player: Player,
    rating: PlayerRating | undefined
}

type LoaderData = {
    player: PlayerWithRating[]
}


export const loader: LoaderFunction = async ({
                                                 request,
                                             }: {
    request: Request;
}) => {
    await requireUserId(request);
    const [players, ratings] = await Promise.all([getActiveAndInactivePlayers(), getAllRatings()]);
    const playerWithRating: PlayerWithRating[] = players.map(player => {
        return {
            player,
            rating: ratings.find(rating => rating.playerId === player.id)
        }
    })


    return json<LoaderData>({player: playerWithRating});
}

const RatingInput = ({player, rating}: { player: Player, rating: PlayerRating | undefined }) => {
    return (
        <div>
            <label
                htmlFor="customRange3"
                className="mb-2 inline-block text-neutral-700 dark:text-neutral-200"
            >{player.name}</label
            >
            <input
                type="range"
                className="transparent h-1.5 w-full cursor-pointer appearance-none rounded-lg border-transparent bg-neutral-200"
                min="10"
                max="100"
                step="5"
                id={`rating-${player.id}`}/>
        </div>
    )
}

const PlayerRating = () => {
    const data = useLoaderData<LoaderData>() as unknown as LoaderData
    return (
        <ContentContainer>
            <Form>
                {
                    data.player.map(row => {
                            return (
                                <div key={row.player.id}>
                                    <RatingInput player={row.player} rating={row.rating}/>
                                </div>

                            )
                        }
                    )}
            </Form>
        </ContentContainer>
    )
}

export default PlayerRating