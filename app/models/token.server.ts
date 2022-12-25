import { prisma } from "~/db.server";
import { DateTime } from "luxon";
import { Simulate } from "react-dom/test-utils";
import play = Simulate.play;
import { Token } from "@prisma/client";

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

        let expirationDate = DateTime.now().plus({ days: 7 }).toJSDate();
        if (gameId) {
            const game = await prisma.game.findUnique({
                where: {
                    id: gameId,
                },
            });
            expirationDate = DateTime.fromJSDate(new Date(game!.gameTime))
                .plus({ days: 7 })
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
