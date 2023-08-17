import {PlayerRating} from "@prisma/client";
import ContentContainer from "~/components/common/container/ContentContainer";
import {Rating} from "~/models/classes/Rating";
import {sortByName} from "~/components/ratings/playerRatingTypes";
import PlayerCard from "~/components/ratings/PlayerCard";

export type PlayerRatingListProps = {
    ratings: PlayerRating[]
}



const PlayerRatingList = ({ratings}: PlayerRatingListProps) => {
    const sortedRatings = ratings
        .map(Rating.fromPlayerRating)
        .sort(sortByName)

    return (
        <ContentContainer>
            <ul className={'grid grid-cols-1 gap-2 md:grid-cols-3'}>
                {
                    sortedRatings.map(rating => {
                        return (
                            <li key={rating.id}>
                                <PlayerCard rating={rating}/>
                            </li>
                        )
                    })
                }
            </ul>
        </ContentContainer>
    )
}

export default PlayerRatingList