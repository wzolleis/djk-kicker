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

export const defaultRating: Rating = new Rating({
    speed: 3,
    technik: 3,
    condition: 3,
    playerName: '',
    position: 'Defender',
    id: ''
})


export const sortByName = (r1: Rating, r2: Rating) => {
    const playerName1 = r1.playerName ?? ''
    const playerName2 = r2.playerName ?? ''
    return playerName1.localeCompare(playerName2)
}

const PlayerPositionValues = ['Defender', 'Attacker', 'Goalkeeper'] as const
export type PlayerPosition = typeof PlayerPositionValues[number]

export const isPlayerPosition = (value: any): value is PlayerPosition => {
    return PlayerPositionValues.some(position => position === value)
}
