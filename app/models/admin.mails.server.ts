import {prisma} from "~/db.server";

export const deleteMailsForGame = async (actionIds: string[]) => {
    return prisma.mail.deleteMany({
        where: {
            actionId: {
                in: actionIds
            }
        }
    })
}

export const deleteMailsForPlayer = async (playerId: string) => {
    return prisma.mail.deleteMany({
        where: {
            playerId
        }
    })
}

export const deleteGameActionsByIds = async (actionIds: string[]) => {
    return prisma.gameAction.deleteMany({
        where: {
            id: {
                in: actionIds
            }
        }
    })
}

export const findActionsForGame = async (gameId: string) => {
    return prisma.gameAction.findMany({where: {gameId}})
}