import type {Feedback, Game, Player} from "@prisma/client";
import {DefaultFeedback} from "@prisma/client";
import {DateTime} from "luxon";
import {configuration} from "~/config";
import {prisma} from "~/db.server";
import {getPlayers} from "~/models/player.server";

export async function getFeedbackForGame(gameId: Feedback["gameId"]) {
    return await prisma.feedback.findMany({ where: { gameId } });
}

export async function getUniqueFeedbackForGameAndPlayer(
    gameId: Game["id"],
    playerId: Player["id"]
): Promise<Feedback> {
    let feedback = await prisma.feedback.findUnique({
        where: {
            playerId_gameId: {
                playerId,
                gameId,
            },
        },
    });
    if (!feedback) {
        feedback = await createFeedbackWithDefaultFeedback(gameId, playerId);
    }
    return feedback;
}

export async function initializePlayers(gameId: string) {
    const game = await prisma.game.findUnique({
        where: {
            id: gameId,
        },
    });
    const players = await getPlayers();
    const expirationDate = DateTime.fromJSDate(new Date(game!.gameTime))
        .plus({ years: 1 })
        .toJSDate();

    for (const player of players) {
        const token = await prisma.token.findUnique({
            where: { playerId: player.id },
        });
        if (!token) {
            await prisma.token.create({
                data: {
                    playerId: player.id,
                    expirationDate: expirationDate,
                },
            });
        } else {
            await prisma.token.update({
                where: {
                    id: token.id,
                },
                data: {
                    expirationDate: expirationDate,
                },
            });
        }
        await createFeedbackWithDefaultFeedback(gameId, player.id);
    }
}

export async function getPlayerFeedbackForGame(
    id: Player["id"],
    gameId: Feedback["gameId"]
) {
    return await prisma.player.findUnique({
        where: { id },
        include: {
            feedback: {
                where: { gameId },
            },
        },
    });
}

export async function findFeedbackWithPlayerIdAndGameId(
    id: Player["id"],
    gameId: Game["id"]
) {
    return await prisma.feedback.findUnique({
        where: {
            playerId_gameId: {
                playerId: id,
                gameId,
            },
        },
    });
}

export async function updateFeedback(
    playerId: Player["id"],
    gameId: Game["id"],
    status: number,
    playerCount: number,
    note: string | null
) {
    return await prisma.feedback.update({
        where: {
            playerId_gameId: {
                playerId,
                gameId,
            },
        },
        data: {
            status,
            playerCount,
            note,
        },
    });
}

export const deleteFeedbackForPlayer = async (playerId: string) => {
    const allFeedback = await getFeedbackByPlayerId(playerId);
    const allOps: Array<Promise<Feedback>> = [];
    allFeedback.forEach((feedback) => {
        allOps.push(deleteFeedback(feedback.id));
    });
    return Promise.all(allOps);
};

export const deleteFeedbackForGame = async (gameId: string) => {
    return await prisma.feedback.deleteMany({ where: { gameId } });
};

export const getFeedbackByPlayerId = async (playerId: string) => {
    return await prisma.feedback.findMany({
        where: {
            playerId: playerId,
        },
    });
};

export const deleteFeedback = async (feedbackId: string) => {
    return await prisma.feedback.delete({
        where: {
            id: feedbackId,
        },
    });
};

type FeedBackCreate = {
    gameId: string;
    playerId: string;
    status: number;
    note?: string | null;

    playerCount?: number;
};

export async function createFeedback({
    gameId,
    playerId,
    status,
    note,
}: FeedBackCreate) {
    return await prisma.feedback.create({
        data: {
            playerId,
            gameId,
            status,
            note,
        },
    });
}

export async function createFeedbackWithDefaultFeedback(
    gameId: string,
    playerId: string
) {
    const defaultFeedback: DefaultFeedback | null =
        await prisma.defaultFeedback.findUnique({ where: { playerId } });
    let feedback: FeedBackCreate = {
        gameId,
        playerId,
        status: configuration.status.unknown,
        playerCount: 0,
    };

    if (!!defaultFeedback) {
        feedback = {
            ...feedback,
            status: defaultFeedback.status,
            playerCount: defaultFeedback.playerCount,
            note: defaultFeedback.note,
        };
    }
    return await createFeedback({ ...feedback });
}

export async function createNewDefaultFeedback(playerId: string) {
    return await prisma.defaultFeedback.upsert({
        where: {
            playerId,
        },
        create: {
            playerId,
        },
        update: {
            playerId,
        },
    });
}

export async function getDefaultFeedback(playerId: string) {
    let defaultFeedback = await prisma.defaultFeedback.findUnique({
        where: {
            playerId,
        },
    });
    if (!defaultFeedback) {
        defaultFeedback = await createNewDefaultFeedback(playerId);
    }
    return defaultFeedback;
}

export async function updateDefaultFeedback({
    playerId,
    status,
    playerCount,
    note,
}: {
    playerId: string;
    status: number;
    playerCount: number;
    note: string | undefined;
}): Promise<DefaultFeedback> {
    return await prisma.defaultFeedback.update({
        where: {
            playerId,
        },
        data: {
            status,
            note: note ? note : null,
            playerCount,
        },
    });
}
