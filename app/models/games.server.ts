import type {Game} from "@prisma/client";
import {prisma} from "~/db.server";
import {getNextGameDay} from "~/utils";
import {DateTime} from "luxon";

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

export async function getGames() {
    return prisma.game.findMany({
        orderBy: {
            gameTime: "desc"
        }
    });
}

export async function getMostRecentGame() {

    return await prisma.game.findMany({
        where: {
            gameTime: {
                gte: getNextGameDay().toJSDate()
            }
        },
        take: 1
    })

}





