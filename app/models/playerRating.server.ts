import {prisma} from "~/db.server";
import {PlayerRating} from "@prisma/client";
import {Rating} from "~/models/classes/Rating";

export const createRatingForPlayer = async (playerId: string, playerName: string, rating: Rating) => {
    const {speed, technik, condition} = rating
    const overall = rating.overall()
    return await prisma.playerRating.create({
        data: {
            playerId,
            overall,
            condition,
            speed,
            technik,
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

export const createRating = async (playerName: string, rating: Rating) => {
    const {speed, technik, condition} = rating
    const overall = rating.overall()
    return await prisma.playerRating.create({
        data: {overall, condition, speed, technik, playerName,},
    })
}