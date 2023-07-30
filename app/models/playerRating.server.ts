import {prisma} from "~/db.server";
import {PlayerRating} from "@prisma/client";
import {PlayerRatingValues} from "~/components/ratings/playerRatingTypes";

export const createDefaultRating = async (playerId: string, playerName: string) => {
    return await prisma.playerRating.create({
        data: {
            playerId,
            overall: 50,
            condition: 50,
            speed: 50,
            technik: 50,
            playerName,
        },
    })
}

export const getAllRatings = async (): Promise<PlayerRating[]> => {
    return await prisma.playerRating.findMany()
}

export const updatePlayerRating = async (ratingId: string, data: Pick<PlayerRating, 'speed' | 'condition' | 'technik' | 'playerName' | 'playerId' | 'overall'>) => {
    return await prisma.playerRating.update({
        where: {
            id: ratingId
        },
        data: {
            ...data
        }
    })
}

export const createRating = async (playerName: string, rating: PlayerRatingValues) => {
    const ratingValueSum = Object.values(rating).map(v => v.ratingValue).reduce((prev, cur) => prev + cur)
    const overall = Math.ceil(ratingValueSum / Object.values(rating).length)
    return await prisma.playerRating.create({
        data: {
            overall,
            condition: rating.Condition.ratingValue,
            speed: rating.Speed.ratingValue,
            technik: rating.Technik.ratingValue,
            playerName,
        },
    })
}