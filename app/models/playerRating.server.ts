import {prisma} from "~/db.server";
import {PlayerRating} from "@prisma/client";

export const calculateRating = (rating: {
    speed: number,
    technik: number,
    condition: number,
    total: number
}) => {
    const {total, speed, technik, condition} = rating
    const sumOfSkills = speed + technik + condition
    const overall = Math.ceil((sumOfSkills / total) * 100)
    return {
        ...rating,
        overall
    }
}

export const createRatingForPlayer = async (playerId: string, playerName: string, rating: {
    overall: number,
    speed: number,
    technik: number,
    condition: number
}) => {
    const {overall, speed, technik, condition} = rating

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

export const createRating = async (playerName: string, rating: {
    overall: number,
    speed: number,
    technik: number,
    condition: number
}) => {
    const {overall, speed, technik, condition} = rating

    return await prisma.playerRating.create({
        data: {overall, condition, speed, technik, playerName,},
    })
}