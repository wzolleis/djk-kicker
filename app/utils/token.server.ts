import {prisma} from "~/db.server";
import type {JWTDecryptResult} from "jose";
import * as jose from 'jose'
import type {KeyObject} from "crypto";
import * as crypto from "crypto";
import type {AdminTokenOptions} from "~/models/classes/AdminTokenOption";
import {createSecretKey} from "crypto";
import type {AdminTokenOptions} from "~/models/classes/AdminTokenOption";
import {DateTime, Interval} from "luxon";


async function getTokenForGame(gameId: string): Promise<string> {
    const game = await prisma.game.findUnique({
        where: {
            id: gameId,
        }
    });
    return game!.token;
}

export async function createPlayerTokenObjectForGame(gameId: string, playerId: string): Promise<string> {
    const game = await prisma.game.findUnique({
        where: {
            id: gameId
        }
    })
    if (!game) {
        throw new Error("Game not found!");
    }
    const playerToken = new PlayerToken(gameId, playerId, DateTime.now().plus({days: 7}).toJSDate(), DateTime.now().toJSDate(), game.token);
    const initialVector = process.env.JWT_SECRET;
    const cipher = crypto.createCipheriv("aes-256-gcm", Buffer.from(process.env.JWT_SECRET!), new Buffer(initialVector!));
    let encrypted = cipher.update(JSON.stringify(playerToken), 'utf-8', 'hex');
    encrypted += cipher.final("hex");
    return encrypted;
}


export async function checkToken(gameId: string, userToken: string): Promise<boolean> {
    const gameToken: string = await getTokenForGame(gameId);
    return gameToken === userToken;
}

export async function createEncryptedAdminToken(adminTokenOptions: AdminTokenOptions): Promise<string> {
    const diff = Interval.fromDateTimes(DateTime.now(), adminTokenOptions.expires_at)
    const days = Math.floor(diff.length('days'))
    const expirationTime = `${days}d`

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
