import {prisma} from "~/db.server";
import * as jose from 'jose'
import type {KeyObject} from "crypto";
import type {AdminTokenOptions} from "~/models/classes/AdminTokenOption";


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

export async function createEncryptedAdminToken(adminTokenOptions: AdminTokenOptions) {
    const {createSecretKey} = require('crypto');
    const secretKey: KeyObject = createSecretKey(process.env.JWT_SECRET, 'utf-8');
    return await new jose.EncryptJWT({...adminTokenOptions})
        .setProtectedHeader({alg: 'dir', enc: 'A256GCM'})
        .setExpirationTime('7d')
        .encrypt(secretKey)


}