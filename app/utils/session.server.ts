import {Player} from "@prisma/client";
import type {Session} from "@remix-run/node";
import {createCookieSessionStorage, redirect} from "@remix-run/node";
import routeLinks from "~/config/routeLinks";
import {PlayerSession} from "~/models/classes/PlayerSession";
import {PlayerToken} from "~/models/classes/PlayerToken";
import {getPlayerById} from "~/models/player.server";
import {getQueryParameter} from "~/utils/parameters.server";
import {checkToken, decryptPlayerToken, playerHasValidToken,} from "~/utils/token.server";

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
    throw new Error("SESSION_SECRET must be set");
}

const PLAYER_SESSION_VALUE = 'player'
const PLAYER_SESSION_COOKIE_NAME = "PlayerSession"

export const {getSession, commitSession, destroySession} = createCookieSessionStorage({
        cookie: {
            name: PLAYER_SESSION_COOKIE_NAME,
            sameSite: "lax",
            secure: process.env.ENVIRONMENT === "production",
            secrets: [sessionSecret],
            path: "/",
            maxAge: 60 * 60 * 24 * 360,
            httpOnly: true,
        },
    });


export async function getPlayerFromDatabaseSession(request: Request): Promise<Player | null> {
    console.group("getPlayerFromDatabaseSession")
    const player = await getPlayerFromRequest(request)
    console.info('>>>>> playerId in session = ', player?.id)
    console.groupEnd()
    return await getPlayerById(player?.id);
}

export async function changePlayer(request: Request, playerToken: PlayerToken) {
    const session = await getUserSession(request)
    const player = await getPlayerById(playerToken.playerId);
    await setSession(session, playerToken, player!);
    return redirect(routeLinks.dashboard);
}

export const authenticatePlayer = async (request: Request): Promise<{isAuthenticated: boolean, session: Session, playerId: string | undefined}> => {
    try {
        console.group("authenticatePlayer")
        const token = getQueryParameter(request, "token", false);
        const decryptedToken = decryptPlayerToken(token);
        console.info('decrypted token = ', decryptedToken)

        const session = await getUserSession(request);
        const playerInSession = await getPlayerFromSession(session)
        const playerId = decryptedToken?.playerId || playerInSession?.id

        console.info('playerid =', playerId)
        const tokenIsValid = !!playerId && await playerHasValidToken(playerId)

        console.info('playerHasValidToken =', tokenIsValid)

        if (playerInSession && tokenIsValid) {
            return {isAuthenticated: true, session, playerId};
        }
        if (playerId && decryptedToken) {
            const isAuthenticated = await checkToken(decryptedToken);
            console.info("setze Player in die Session, playerId =", playerId)

            session.set("player", await getPlayerById(playerId));
            return {isAuthenticated: isAuthenticated, session, playerId};
        }
        console.error('Spieler ist nicht authenticated', playerId)

        return {isAuthenticated: false, session, playerId};
    } finally {
        console.groupEnd()
    }
}

export async function getUserSession(request: Request) {
    return await getSession(request.headers.get("Cookie"));
}

export const getPlayerFromRequest = async (request: Request): Promise<Player | null> => {
    console.group("getPlayerFromRequest")
    const session = await getUserSession(request)
    console.groupEnd()
    return getPlayerFromSession(session)
}

export async function getPlayerFromSession(session: Session): Promise<Player | null> {
    console.group("getPlayerFromSession")
    try { //  first try
        if (session.has(PLAYER_SESSION_VALUE)) {
            console.info('"player" in session')
            return session.get(PLAYER_SESSION_VALUE)
        }

        // second try
        if (session.has(PLAYER_SESSION_COOKIE_NAME)) {
            console.info('"playerSession" in session')
            return session.get(PLAYER_SESSION_COOKIE_NAME)
        }

        // kein player in der Session
        console.error("kein player in der Session")
        return null
    } finally {
        console.groupEnd()
    }
}

async function setSession(session: Session, playerToken: PlayerToken, player: Player) {
    if (player) {
        session.set(PLAYER_SESSION_VALUE, player);
    }
    return await commitSession(session);
}