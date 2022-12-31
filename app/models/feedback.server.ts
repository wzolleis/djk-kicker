import type {Feedback, Game, Player} from "@prisma/client";
import {DefaultFeedback} from "@prisma/client";
import {prisma} from "~/db.server";
import {Nullable} from "vitest";
import {configuration} from "~/config";
import {DateTime} from "luxon";

export async function getFeedbackForGame(gameId: Feedback["gameId"]) {
    return await prisma.feedback.findMany({where: {gameId}});
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
        feedback = await createDefaultFeedback(gameId, playerId);
    }
    return feedback;
}

export async function initializePlayers(gameId: string) {
    const game = await prisma.game.findUnique({
        where: {
            id: gameId,
        },
    });
    const players = await prisma.player.findMany();
    const expirationDate = DateTime.fromJSDate(
        new Date(game!.gameTime)
    ).toJSDate();
    for (const player of players) {
        const token = await prisma.token.findUnique({
            where: {
                playerId: player.id,
            },
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
        await createDefaultFeedback(gameId, player.id);
    }
}

export async function getPlayerFeedbackForGame(
    id: Player["id"],
    gameId: Feedback["gameId"]
) {
    return await prisma.player.findUnique({
        where: {id,},
        include: {
            feedback: {
                where: {gameId,},
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
    const allFeedback = await getFeedbackByPlayerId(playerId)
    const allOps: Array<Promise<Feedback>> = []
    allFeedback.forEach((feedback) => {
         allOps.push(deleteFeedback(feedback.id))
    })
    return Promise.all(allOps)
}

export const getFeedbackByPlayerId = async (playerId: string) => {
    return await prisma.feedback.findMany({
        where: {
            playerId: playerId
        }
    })
}

export const deleteFeedback = async (feedbackId: string) => {
    return await prisma.feedback.delete({
        where: {
            id: feedbackId
        }
    })
}

export async function createFeedback(
    playerId: Player["id"],
    gameId: Game["id"],
    status: number,
    note: Nullable<string>
) {
    return await prisma.feedback.create({
        data: {
            playerId,
            gameId,
            status,
            note,
        },
    });
}

export async function createDefaultFeedback(
    gameId: Game["id"],
    playerId: Player["id"]
) {
    const defaultFeedback = await prisma.defaultFeedback.findUnique({
        where: {
            playerId,
        },
    });
    if (defaultFeedback) {
        return await prisma.feedback.create({
            data: {
                gameId,
                playerId,
                status: defaultFeedback.status,
                playerCount: defaultFeedback.playerCount,
                note: defaultFeedback.note,
            },
        });
    }
    return await prisma.feedback.create({
        data: {
            gameId,
            playerId,
            status: configuration.status.unknown,
        },
    });
}

export async function createNewDefaultFeedback(playerId: string) {
    return await prisma.defaultFeedback.create({
        data: {
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

export async function updateDefaultFeedback(
    playerId: Player["id"],
    status: number,
    playerCount: number,
    note?: string
): Promise<DefaultFeedback> {
    return await prisma.defaultFeedback.update({
        where: {
            playerId,
        },
        data: {
            status,
            note,
            playerCount,
        },
    });
}
