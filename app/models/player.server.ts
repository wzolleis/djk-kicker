import type {Player} from "@prisma/client";
import {Feedback, Game} from "@prisma/client";
import {prisma} from "~/db.server";
import {getUniqueFeedbackForGameAndPlayer} from "~/models/feedback.server";
import {deleteMailsForPlayer} from "~/models/admin.mails.server";

export type {Player} from "@prisma/client";

export type PlayerMailData = {
    name: string,
    id: string,
    email: string
}

export async function getPlayers() {
    return prisma.player.findMany();
}

export const
    getPlayerDataForMail = async (playerIds: string[]): Promise<PlayerMailData[]> => {
    return await prisma.player.findMany({
            select: {
                name: true,
                id: true,
                email: true,
            },
            where: {
                id: {
                    in: playerIds
                }
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

export interface PlayerWithFeedback extends Player {
    feedback: Feedback;
}

export async function getPlayersWithUniqueFeedbackForGame(gameId: Game["id"]): Promise<PlayerWithFeedback[]> {
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

export async function createPlayer(name: string, email: string) {
    return await prisma.player.create({
        data: {
            name,
            email,
        },
    });
}

export async function updatePlayer(id: Player["id"], name: string, email: string) {
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

export async function deletePlayer(id: Player["id"]) {
    return await Promise.all([deleteMailsForPlayer(id),
        prisma.player.delete({where: {id}})
    ]);
}
