import type {Game} from "@prisma/client";
import {prisma} from "~/db.server";
import {getNextGameDay} from "~/utils";

export type {Game} from "@prisma/client";

export async function getGameById(gameId: string) {
    try {
        return prisma.game.findUnique({
            where: {id: gameId},
            include: {
                feedback: {
                    include: {
                        player: true,
                    },
                },
            },
        });
    } catch (error) {
        console.log("ignore error", error)
        return null
    }
}

export async function findGameById(id: Game["id"]) {
    return await prisma.game.findUnique({
        where: {id},
    });
}

export async function getGames() {
    return prisma.game.findMany({
        orderBy: {
            gameTime: "desc",
        },
    });
}

export async function getMostRecentGame(): Promise<Game | null> {
    const nextGameDate = getNextGameDay();
    const nextGame = await prisma.game.findFirst({
        where: {
            gameTime: {
                gte: nextGameDate.toJSDate(),
            },
        },
        orderBy: {
            gameTime: "asc",
        },
    });

    if (!nextGame) {
        return await getLastGame();
    }

    return nextGame;
}

export async function getLastGame(): Promise<Game | null> {
    return await prisma.game.findFirst({
        orderBy: {
            gameTime: "asc",
        },
    });
}
