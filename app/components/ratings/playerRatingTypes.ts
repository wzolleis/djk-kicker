import {Rating} from "~/models/classes/Rating";

export type RatingType = 'Speed' | 'Condition' | 'Technik'

export type RatingSelection = {
    ratingType: RatingType
    ratingValue: number
    total: number
}


export type PlayerRatingValues = {
    [key in RatingType]: {
        ratingValue: number;
        ratingType: RatingType,
        total: number
    };
};

export const defaultRating: Rating = new Rating({speed: 3, technik: 3, condition: 3, playerName: '', id: ''})