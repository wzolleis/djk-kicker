import {PlayerRating} from "@prisma/client";
import ContentContainer from "~/components/common/container/ContentContainer";
import {Rating} from "~/models/classes/Rating";
import PlayerRatingInput from "~/components/ratings/PlayerRatingInput";
import {useMemo} from "react";

export type PlayerRatingListProps = {
    ratings: PlayerRating[]
}

const getImage = (overall: number) => {
    if (overall > 80) {
        return "/img/players/player_100_3.svg"
    } else if (overall > 50) {
        return "/img/players/player_50.svg"
    } else {
        return "/img/players/player_20.svg"
    }
}

const PlayerCard = ({rating}: {
    rating: Rating
}) => {

    const image = useMemo(() => getImage(rating.overall()), [rating])

    const onRatingChanged = (rating: Rating) => {

    }

    return (
        <div className="grid grid-cols-2 m-3 rounded-lg bg-blue-200 md:max-w-xl md:flex-row">
            <div className={'grid grid-cols-3 col-span-2 m-5'}>
                <img src={image} alt=""
                     className="mx-3 h-24 w-24 md:h-32 md:w-32 mr-5 col-span-2"
                />
                <div className={'w-20 h-20 rounded-full flex m-5 justify-center items-center bg-white text-black mr-5'}>
                    <h2 className={'font-default-bold text-title-large tracking-tighter text-black'}>{`${rating.overall()}`}</h2>
                </div>
            </div>
            <div className={'col-span-2'}>
                <h5 className="px-3 text-xl font-medium text-neutral-800">
                    {rating.playerName}
                </h5>
                <div className="flex flex-col justify-start p-6">
                    <p className="mb-4 text-base text-neutral-600">
                        <PlayerRatingInput rating={rating} onChange={onRatingChanged}/>
                    </p>
                </div>
            </div>
        </div>
    )
}

const PlayerRatingList = ({ratings}: PlayerRatingListProps) => {
    const sortedRatings = ratings
        .map(Rating.fromPlayerRating)
        .sort((r1, r2) => r2.overall() - r1.overall())

    return (
        <ContentContainer>
            <ul>
                <li>
                    {
                        sortedRatings.map(rating => {
                            return (
                                <PlayerCard key={rating.id} rating={rating}/>
                            )
                        })
                    }
                </li>
            </ul>
        </ContentContainer>
    )
}

export default PlayerRatingList