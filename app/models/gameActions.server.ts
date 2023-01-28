import {GameAction} from "@prisma/client";
import {prisma} from "~/db.server";
import {ActionType} from "~/config/applicationTypes";

export const createGameAction = async ({gameId, actionType}: {gameId: string, actionType: ActionType}) => {
    return await prisma.gameAction.create({
        data: {
            gameId,
            actionType
        }
    })
}
export const updateGameAction = async (action: GameAction) => {
    return await prisma.gameAction.update({
        where: {
            id: action.id
        },
        data: {
            status: action.status,
            statusTxt: action.statusTxt
        }
    })
}

export const findActionsByGameId = async ({gameId}: {gameId: string}) => {
    return await prisma.gameAction.findMany({
        where: {
            gameId
        }
    })
}

export const findAllGameActions = async () => {
    return await prisma.gameAction.findMany()
}