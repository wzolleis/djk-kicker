import {prisma} from "~/db.server";
import {PlayerRating} from "@prisma/client";

export const createDefaultRating = async (playerId: string) => {
    return await prisma.playerRating.create({
        data: {
            playerId,
            overall: 50,
            condition: 50,
            speed: 50,
            technik: 50
        },
    })
}

export const getAllRatings = async (): Promise<PlayerRating[]> => {
    return await prisma.playerRating.findMany()
}

export const updatePlayerRating = async (playerId: string, data: Pick<PlayerRating, 'speed' | 'condition' | 'technik'>) => {
    return await prisma.playerRating.update({
        where: {
            playerId
        },
        data: {
            ...data
        }
    })
}