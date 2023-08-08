import {prisma} from "~/db.server";
import {PlayerRating} from "@prisma/client";
import {Rating} from "~/models/classes/Rating";

export const createRatingForPlayer = async (playerId: string, playerName: string, rating: Rating) => {
    const {speed, technik, condition} = rating
    return await prisma.playerRating.create({
        data: {
            playerId,
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

export const getPlayerRatingById = async (id: string | undefined) => {
    if (!id) {
        throw new Error("No rating Id provided");
    }
    return await prisma.playerRating.findUnique({where: {id}})
}

export const updatePlayerRating = async (ratingId: string, data: Pick<PlayerRating, 'speed' | 'condition' | 'technik' | 'playerName' | 'playerId'>) => {
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
    return await prisma.playerRating.create({
        data: {condition, speed, technik, playerName,},
    })
}