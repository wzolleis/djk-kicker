import {RatingWithId} from "~/models/classes/RatingWithId";
import {PlayerModel} from "~/matches/teamTypes";
import {Rating} from "~/models/classes/Rating";
import {v4 as uuidv4} from 'uuid';

const mapRatingToPlayerModel = (ratingWithId: RatingWithId): PlayerModel => {
    const rating: Rating = ratingWithId.rating
    return {
        anwesend: true,
        name: rating.playerName ?? 'Gast',
        id: rating.id ?? uuidv4(),
        condition: rating.condition,
        speed: rating.speed,
        technicalSkill: rating.technik
    }
}

export const mapToPlayerModel = (ratings: RatingWithId[]): PlayerModel[] => {
    return ratings.map(mapRatingToPlayerModel)
}