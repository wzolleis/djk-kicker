import { Player } from "@prisma/client";
import type { Session } from "@remix-run/node";
import { createCookieSessionStorage, redirect } from "@remix-run/node";
import routeLinks from "~/config/routeLinks";
import { PlayerSession } from "~/models/classes/PlayerSession";
import { PlayerToken } from "~/models/classes/PlayerToken";
import { getPlayerById } from "~/models/player.server";
import { getQueryParameter } from "~/utils/parameters.server";
import {
    checkToken,
    decryptPlayerToken,
    playerHasValidToken,
} from "~/utils/token.server";

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
    throw new Error("SESSION_SECRET must be set");
}

export const { getSession, commitSession, destroySession } =
    createCookieSessionStorage({
        cookie: {
            name: "PlayerSession",
            sameSite: "lax",
            secure: process.env.ENVIRONMENT === "production",
            secrets: [sessionSecret],
            path: "/",
            maxAge: 60 * 60 * 24 * 360,
            httpOnly: true,
        },
    });

export async function getPlayerFromDatabaseSession(request: Request) {
    const session = await getSession(request.headers.get("Cookie"));
    return await getPlayerById(session.get("player").id);
}

export async function changePlayer(request: Request, playerToken: PlayerToken) {
    const session = await getSession(request.headers.get("Cookie"));
    const player = await getPlayerById(playerToken.playerId);
    await setSession(session, playerToken, player!);
    return redirect(routeLinks.dashboard);
}

export async function authenticatePlayer(request: Request) {
    const token = getQueryParameter(request, "token", false);
    const decryptedToken = decryptPlayerToken(token);
    const session = await getUserSession(request);
    const playerId = decryptedToken?.playerId || session.get("player")?.id;
    if (
        session.get("player") &&
        (await playerHasValidToken(session.get("player").id))
    ) {
        return { isAuthenticated: true, session, playerId };
    }
    if (playerId && decryptedToken) {
        const isAuthenticated = await checkToken(decryptedToken);
        session.set("player", await getPlayerById(playerId));
        return { isAuthenticated: isAuthenticated, session, playerId };
    }
    return { isAuthenticated: false, session, playerId };
}

export async function getUserSession(request: Request) {
    return await getSession(request.headers.get("Cookie"));
}

export async function getPlayerFromSession(
    request: Request
): Promise<Player | null> {
    const session = await getSession(request.headers.get("Cookie"));
    if (!session.has("playerSession")) {
        return null;
    }
    return session.get("playerSession");
}

async function setSession(
    session: Session,
    playerToken: PlayerToken,
    player: Player
) {
    if (player) {
        session.set("player", player);
    }
    return await commitSession(session);
}

function sessionHasPlayer(session: Session) {
    return !!session.get("player");
}
