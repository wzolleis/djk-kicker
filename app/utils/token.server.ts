import { prisma } from "~/db.server";
import type { JWTDecryptResult } from "jose";
import * as jose from "jose";
import type { KeyObject } from "crypto";
import { createSecretKey } from "crypto";
import type { AdminTokenOptions } from "~/models/classes/AdminTokenOption";
import { DateTime, Interval } from "luxon";
import { PlayerToken } from "~/models/classes/PlayerToken";
import { getPlayerById } from "~/models/player.server";
import { Player, Token } from "@prisma/client";
import { getPlayerToken } from "~/models/token.server";

function createEncryptionArguments() {
    const algorithm: string = "aes-256-ctr";
    const key = process.env.ENCRYPTION_KEY;
    const iv = process.env.INIT_VECTOR;
    if (!key || !iv) {
        throw new Error("Invalid Encryption Configuration!");
    }
    const keyBuffer = Buffer.from(key);
    const ivBuffer = Buffer.from(iv);

    return { algorithm, keyBuffer, ivBuffer };
}

function encryptData(data: string | object): string {
    const crypto = require("crypto");
    const {
        algorithm,
        keyBuffer,
        ivBuffer,
    }: { algorithm: string; keyBuffer: Buffer; ivBuffer: Buffer } =
        createEncryptionArguments();
    const cipher = crypto.createCipheriv(algorithm, keyBuffer, ivBuffer);
    const dataBase64Url = Buffer.from(JSON.stringify(data)).toString(
        "base64url"
    );
    return (
        cipher.update(dataBase64Url, "base64url", "base64url") +
        cipher.final("base64url")
    );
}

function decryptData(data: string) {
    const crypto = require("crypto");
    const {
        algorithm,
        keyBuffer,
        ivBuffer,
    }: { algorithm: string; keyBuffer: Buffer; ivBuffer: Buffer } =
        createEncryptionArguments();
    const decipher = crypto.createDecipheriv(algorithm, keyBuffer, ivBuffer);
    return decipher.update(data, "base64url", "utf8") + decipher.final("utf8");
}

async function getTokenForGame(gameId: string): Promise<string> {
    const game = await prisma.game.findUnique({
        where: {
            id: gameId,
        },
    });
    return game!.token;
}

export async function createEncryptedPlayerToken(
    playerId: string,
    gameId: string
) {
    const playerToken = await getPlayerToken(playerId, gameId);
    return encryptData(playerToken);
}

export function decryptPlayerToken(encryptedToken: string): Token {
    const decryptedToken = decryptData(encryptedToken);
    return JSON.parse(decryptedToken.toString());
}

export async function verifyToken(playerToken: PlayerToken) {
    let isAuthenticated = false;
    try {
        const token = await getPlayerToken(playerToken.playerId);
        if (token && !token.revoked && !hasTokenExpired(token.expirationDate)) {
            isAuthenticated = true;
        }
    } catch (e) {}

    const player = playerToken?.playerId
        ? await getPlayerById(playerToken?.playerId)
        : null;
    return { isAuthenticated, player, playerToken };
}

function hasTokenExpired(tokenExpiresAt: Token["expirationDate"]) {
    const expirationDate = DateTime.fromJSDate(new Date(tokenExpiresAt));
    return expirationDate < DateTime.now();
}

export async function playerHasValidToken(playerId: string): Promise<boolean> {
    try {
        const token = await getPlayerToken(playerId, undefined, true);
        return !token.revoked && !hasTokenExpired(token.expirationDate);
    } catch (e) {
        return false;
    }
}

export async function createEncryptedAdminToken(
    adminTokenOptions: AdminTokenOptions
): Promise<string> {
    const diff = Interval.fromDateTimes(
        DateTime.now(),
        adminTokenOptions.expires_at
    );
    const days = Math.floor(diff.length("days"));
    const expirationTime = `${days}d`;

    const secretKey: KeyObject = createSecretKey(
        getArrayBufferFromSecret(process.env.JWT_SECRET!)
    );
    return await new jose.EncryptJWT({ ...adminTokenOptions })
        .setProtectedHeader({
            alg: "dir",
            enc: "A256GCM",
        })
        .setExpirationTime("7d")
        .encrypt(secretKey);
}

export async function decryptEncryptedAdminToken(
    token: string
): Promise<JWTDecryptResult> {
    const secretKey: KeyObject = createSecretKey(
        getArrayBufferFromSecret(process.env.JWT_SECRET!)
    );
    return await jose.jwtDecrypt(token, secretKey);
}

function getArrayBufferFromSecret(secret: string): Uint8Array {
    return new TextEncoder().encode(secret);
}
