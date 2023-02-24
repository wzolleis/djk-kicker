import { Player } from "@prisma/client";
import type { Session } from "@remix-run/node";
import { createCookieSessionStorage, redirect } from "@remix-run/node";
import { UserAuthentication } from "~/config/applicationTypes";
import routeLinks from "~/config/routeLinks";
import { PlayerSession } from "~/models/classes/PlayerSession";
import { PlayerToken } from "~/models/classes/PlayerToken";
import { getPlayerById } from "~/models/player.server";
import { createDatabaseSessionStorage } from "~/session.server";
import { getCommonSearchParameters } from "~/utils/parameters.server";
import {
    decryptPlayerToken,
    playerHasValidToken,
    verifyToken,
} from "~/utils/token.server";

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
    throw new Error("SESSION_SECRET must be set");
}

const { getSession, commitSession, destroySession } =
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

export async function authenticatePlayer(
    request: Request
): Promise<UserAuthentication> {
    let isAuthenticated = false;
    const { token } = getCommonSearchParameters(request);
    const session = await getSession(request.headers.get("Cookie"));
    let isFirstAuthentication = false;

    if (!!token && !sessionHasPlayer(session)) {
        let cookieHeader;
        const { isAuthenticated, player, playerToken } = await verifyToken(
            decryptPlayerToken(token)
        );
        if (isAuthenticated && playerToken) {
            cookieHeader = await setSession(session, playerToken, player!);
            isFirstAuthentication = true;
        } else cookieHeader = await commitSession(session);
        return {
            isAuthenticated,
            session,
            cookieHeader,
            player,
            isFirstAuthentication,
        };
    } else if (sessionHasPlayer(session)) {
        const playerId = session.get("player").id;
        const isAuthenticated = await playerHasValidToken(playerId);
        const player = await getPlayerById(playerId);
        const cookieHeader = await commitSession(session);

        return {
            isAuthenticated,
            session,
            cookieHeader,
            player,
            isFirstAuthentication,
        };
    } else {
        return {
            isAuthenticated,
            session,
            cookieHeader: "",
            player: null,
            isFirstAuthentication,
        };
    }
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
