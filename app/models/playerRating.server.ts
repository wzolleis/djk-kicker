import {prisma} from "~/db.server";
import {PlayerRating} from "@prisma/client";

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