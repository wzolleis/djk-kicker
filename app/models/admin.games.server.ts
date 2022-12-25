import {prisma} from "~/db.server";
import type {Game} from "@prisma/client";
import toast from "react-hot-toast/headless";
import {DateTime} from "luxon";
import {initializePlayers} from "~/models/feedback.server";

export const readGames = async (): Promise<Game[]> => {
    return await prisma.game.findMany({
        orderBy: {
            gameTime: "desc",
        },
    });
};

export const readExpiredGames = async (): Promise<Game[]> => {
    return await prisma.game.findMany({
        orderBy: {
            gameTime: "desc",
        },
        where: {
            gameTime: {
                lt: new Date()
            }
        }
    });
};

export const createGame = async (
    gameTime: DateTime,
    name: string,
    location: string
) => {
    const {id} = await prisma.game.create({
        data: {
            name: name,
            gameTime: gameTime.toJSDate(),
            spielort: location,
        },
    });
    initializePlayers(id);
};

export const updateGame = async (game: Game) => {
    await prisma.game.update({data: game, where: {id: game.id}});
};

export const deleteGame = async (gameId: string) => {
    await prisma.game
        .delete({where: {id: gameId}})
        .then(() => toast.success("Game successfully deleted"));
};

export const deleteExpiredGames = async () => {
    return await prisma.game
        .deleteMany({where: {gameTime: {lt: new Date()}}})
};


export const findGameById = async (gameId: string): Promise<Game> => {
    const game = await prisma.game.findUnique({where: {id: gameId}});
    if (!game) {
        throw new Response("Not Found", {
            status: 404,
            statusText: `Es gibt kein Spiel mit der ID ${gameId}`,
        });
    }

    return game;
};
