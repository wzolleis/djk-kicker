import type {Player} from "@prisma/client";
import {Feedback} from "@prisma/client";
import {prisma} from "~/db.server";
import {deleteFeedbackForPlayer, getUniqueFeedbackForGameAndPlayer} from "~/models/feedback.server";
import {deleteMailsForPlayer} from "~/models/admin.mails.server";
import {deleteTokenForPlayer} from "~/models/token.server";
import {deleteSessionForPlayer} from "~/models/session.server";
import invariant from "tiny-invariant";

export type {Player} from "@prisma/client";

export async function getPlayers() {
    return prisma.player.findMany();
}

export const findManyPlayerById = async (playerIds: string[]): Promise<Player[]> => {
    return await prisma.player.findMany({
            select: {
                name: true,
                id: true,
                email: true,
            },
            where: {
                id: {in: playerIds}
            }
        }
    )
}

export async function getPlayerById(id: Player["id"]) {
    if (!id) {
        throw new Error("No player Id provided");
    }
    return await prisma.player.findUnique({where: {id}});
}

export async function getPlayerByMail(email: string) {
    // es gibt nur einen Player, da die mail unique sein muss
    const player = await prisma.player.findMany({where: {email}})
    invariant(player.length === 1, `es wurden '${player.length}' Spieler mit der Email '${email}' gefunden`)
    return player[0]
}

export interface PlayerWithFeedback extends Player {
    feedback: Feedback;
}

export async function getPlayersWithUniqueFeedbackForGame(gameId: string): Promise<PlayerWithFeedback[]> {
    const playersWithFeedback: PlayerWithFeedback[] = [];
    const players = await prisma.player.findMany();
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

export async function updatePlayer(id: string, name: string, email: string) {
    return await prisma.player.update({
        where: {
            id,
        },
        data: {
            name,
            email,
        },
    });
}

export async function deletePlayer(id: string) {
    return await Promise.all([
        deleteFeedbackForPlayer(id),
        deleteMailsForPlayer(id),
        deleteTokenForPlayer(id),
        deleteSessionForPlayer(id),
        prisma.player.delete({where: {id}})
    ]);
}
