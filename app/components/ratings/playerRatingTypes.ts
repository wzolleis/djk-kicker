export type PlayerRatingData = {
    ratingType: string
    total: number
    rating: number
}

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
