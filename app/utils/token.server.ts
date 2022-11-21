import {prisma} from "~/db.server";
import * as jose from 'jose'
import type {KeyObject} from "crypto";
import type {AdminTokenOptions} from "~/models/classes/AdminTokenOption";
import {createSecretKey} from "crypto";
import type {JWTDecryptResult} from "jose";


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

export async function createEncryptedAdminToken(adminTokenOptions: AdminTokenOptions): Promise<string> {
    const secretKey: KeyObject = createSecretKey(getArrayBufferFromSecret(process.env.JWT_SECRET!));
    return await new jose.EncryptJWT({...adminTokenOptions})
        .setProtectedHeader({alg: 'dir', enc: 'A256GCM'})
        .setExpirationTime('7d')
        .encrypt(secretKey)
}

export async function decryptEncryptedAdminToken(token: string): Promise<JWTDecryptResult> {
    const secretKey: KeyObject = createSecretKey(getArrayBufferFromSecret(process.env.JWT_SECRET!));
    return await jose.jwtDecrypt(token, secretKey);
}

function getArrayBufferFromSecret(secret: string): Uint8Array {
    return new TextEncoder().encode(secret);
}
