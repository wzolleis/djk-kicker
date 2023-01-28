import {prisma} from "~/db.server";
import type {Game} from "@prisma/client";
import {DateTime} from "luxon";
import {deleteFeedbackForGame, initializePlayers} from "~/models/feedback.server";
import {GameStatus} from "~/config/admin.game.constants";
import {deleteGameActionsByIds, deleteMailsForGame, findActionsForGame} from "~/models/admin.mails.server";

export const findAllGames = async (): Promise<Game[]> => {
    return await prisma.game.findMany({
        orderBy: {
            gameTime: "desc",
        },
    });
};

export const findExpiredGames = async (): Promise<Game[]> => {
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

export const updateGameStatus = async (gameId: string, status: GameStatus) => {
    await prisma.game.update({data: {status: status}, where: {id: gameId}});
}

export const deleteGame = async (gameId: string) => {
    const gameActions = await findActionsForGame(gameId)
    const gameActionIds = gameActions.map(action => action.id)
    await Promise.all(
        [
            deleteMailsForGame(gameActionIds),
            deleteGameActionsByIds(gameActionIds),
            deleteFeedbackForGame(gameId),
            prisma.game.delete({where: {id: gameId}})
        ]
    )
};

export const deleteExpiredGames = async () => {
    const games = await findExpiredGames()
    const results = []
    for (let i = 0; i < games.length; i++) {
        results.push(deleteGame(games[i].id))
    }
    await Promise.all(results)
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