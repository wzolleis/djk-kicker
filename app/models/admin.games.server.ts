import {prisma} from "~/db.server";
import type {Game} from "@prisma/client";
import {GameFromForm} from "~/utils/game.server";

export const readGames = async (): Promise<Game[]> => {
    return await prisma.game.findMany({
        orderBy: {
            gameTime: "desc"
        }
    });
};

export const createGame = async (game: Pick<Game, "gameTime" | "name" | "spielort">) => {
    await prisma.game.create({data: game});
};

export const updateGame = async (game: Game) => {

    await prisma.game.update({data: game, where: {id: game.id}});
};

export const deleteGame = async (gameId: string) => {
    await prisma.game.delete({where: {id: gameId}});
};


export const findGameById = async (gameId: string): Promise<Game> => {
    const game = await prisma.game.findUnique({where: {id: gameId}});
    if (!game) {
        throw new Response("Not Found", {
            status: 404,
            statusText: `Es gibt kein Spiel mit der ID ${gameId}`
        });
    }

    return game;
};
