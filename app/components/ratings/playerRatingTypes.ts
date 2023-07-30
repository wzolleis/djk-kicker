export type PlayerRatingData = {
    ratingType: string
    total: number
    rating: number
}

export type RatingType = 'Speed' | 'Condition' | 'Technik'

export type PlayerStarRating = {
    rating: PlayerRatingData
    label: string,
    readonly: boolean
}

export type RatingSelection = {
    ratingType: RatingType
    ratingValue: number
    total: number
}