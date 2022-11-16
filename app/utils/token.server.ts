import {prisma} from "~/db.server";

async function getTokenForGame(gameId: string): Promise<string> {
    const game = await prisma.game.findUnique({
        where: {
            id: gameId,
        }
    });

    return game!.token;
}


export async function checkToken(gameId: string, userToken: string): Promise<boolean> {
    const gameToken: string = await getTokenForGame(gameId);
    return gameToken === userToken;
}