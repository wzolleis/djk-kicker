import {RatingWithId} from "~/models/classes/RatingWithId";
import {PlayerModel} from "~/matches/teamTypes";
import {Rating} from "~/models/classes/Rating";
import {v4 as uuidv4} from 'uuid';

const mapRatingToPlayerModel = (ratingWithId: RatingWithId, index: number): PlayerModel => {
    const rating: Rating = ratingWithId.rating
    return {
        anwesend: true,
        name: rating.playerName ?? 'Gast',
        id: rating.id ?? uuidv4(),
        playerNumber: index + 1,
        condition: rating.condition,
        speed: rating.speed,
        technicalSkill: rating.technik,
        position: rating.position
    }
}

export const mapToPlayerModel = (ratings: RatingWithId[]): PlayerModel[] => {
    return ratings.map(mapRatingToPlayerModel)
}