import type {Game} from "@prisma/client";
import {prisma} from "~/db.server";
import {getNextGameDay} from "~/utils";

export type {Game} from "@prisma/client";

export async function getGameById(id: Game["id"]) {
    return prisma.game.findUnique({
        where: {id}, include: {
            feedback: {
                include: {
                    player: true
                }
            }
        }
    });
}


export async function findGameById(id: Game['id']) {
    return await prisma.game.findUnique({
        where: {id}
    })
}

export async function getGames() {
    const nextGameDate = getNextGameDay()
    return prisma.game.findMany({
            where: {
                gameTime: {
                    gte: nextGameDate.toJSDate()
                }
            },
            orderBy: {
                gameTime: 'asc'
            }
        }
    )
}

export async function getMostRecentGame(): Promise<Game | null> {
    const nextGameDate = getNextGameDay()
    return await prisma.game.findFirst({
        where: {
            gameTime: {
                gte: nextGameDate.toJSDate()
            }
        },
        orderBy: {
            gameTime: 'asc'
        }
    })
}





