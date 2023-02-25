import { Token } from "@prisma/client";
import { DateTime } from "luxon";
import { prisma } from "~/db.server";

export async function getPlayerToken(
    playerId: string,
    gameId?: string,
    hasToBePresent: boolean = false
): Promise<Token> {
    let playerToken = await prisma.token.findUnique({
        where: {
            playerId,
        },
    });

    if (!playerToken) {
        if (hasToBePresent) {
            throw new Error("No Player Token found");
        }
        let expirationDate = DateTime.now().plus({ years: 1 }).toJSDate();
        if (gameId) {
            const game = await prisma.game.findUnique({
                where: {
                    id: gameId,
                },
            });
            expirationDate = DateTime.fromJSDate(new Date(game!.gameTime))
                .plus({ years: 1 })
                .toJSDate();
        }
        playerToken = await prisma.token.create({
            data: {
                playerId,
                expirationDate,
            },
        });
    }

    return playerToken;
}

export const deleteTokenForPlayer = async (playerId: string) => {
    return prisma.token.delete({ where: { playerId } });
};
