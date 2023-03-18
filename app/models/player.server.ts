import type {Player} from "@prisma/client";
import {Feedback} from "@prisma/client";
import {prisma} from "~/db.server";
import {deleteFeedbackForPlayer, getUniqueFeedbackForGameAndPlayer} from "~/models/feedback.server";
import {deleteTokenForPlayer} from "~/models/token.server";
import {deleteSessionForPlayer} from "~/models/session.server";

export type {Player} from "@prisma/client";

export async function getPlayers() {
    return prisma.player.findMany({
        where: {
            isActive: true
        }
    });
}

export const findManyPlayerById = async (playerIds: string[]): Promise<Player[]> => {
    return await prisma.player.findMany({
            where: {
                id: {in: playerIds}
            }
        }
    )
}

export async function getPlayerById(id: string | undefined) {
    if (!id) {
        throw new Error("No player Id provided");
    }
    return await prisma.player.findUnique({where: {id}});
}

export async function getPlayerByMail(email: string): Promise<Player | null> {
    // es gibt nur einen Player, da die mail unique sein muss
    return await prisma.player.findUnique({where: {email}})
}

export interface PlayerWithFeedback extends Player {
    feedback: Feedback;
}

export async function getPlayersWithUniqueFeedbackForGame(gameId: string): Promise<PlayerWithFeedback[]> {
    const playersWithFeedback: PlayerWithFeedback[] = [];
    const players = await getPlayers()
    for (const player of players) {
        const feedback = await getUniqueFeedbackForGameAndPlayer(gameId, player.id);
        const playerWithFeedback: PlayerWithFeedback = {
            ...player,
            feedback,
        };
        playersWithFeedback.push(playerWithFeedback);
    }
    return playersWithFeedback;
}

export async function createPlayer(name: string, email: string): Promise<Player> {
    return await prisma.player.create({
        data: {
            name,
            email,
        },
    });
}

export async function deletePlayer(id: string) {
    return await Promise.all([
        deleteFeedbackForPlayer(id),
        deleteTokenForPlayer(id),
        deleteSessionForPlayer(id),
        prisma.player.delete({where: {id}})
    ]);
}
