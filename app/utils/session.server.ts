import type { Session } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { decryptPlayerToken, verifyToken } from "~/utils/token.server";
import type { Params } from "react-router";
import { Player } from "@prisma/client";
import { PlayerSession } from "~/models/classes/PlayerSession";
import { getPlayerById } from "~/models/player.server";
import { createDatabaseSessionStorage } from "~/session.server";
import {
    getCommonParameters,
    getCommonSearchParameters,
} from "~/utils/parameters.server";
import { PlayerToken } from "~/models/classes/PlayerToken";
import { Simulate } from "react-dom/test-utils";
import play = Simulate.play;

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
    throw new Error("SESSION_SECRET must be set");
}

const { getSession, commitSession, destroySession } =
    createDatabaseSessionStorage({
        cookie: {
            name: "PlayerSession",
            sameSite: "lax",
            secure: process.env.ENVIRONMENT === "production",
            secrets: [sessionSecret],
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
            httpOnly: true,
        },
    });

export type UserAuthentication = {
    isAuthenticated: boolean;
    session?: Session;
    cookieHeader: string;
    player?: Player | null;
    isFirstAuthentication: boolean;
};

export async function getPlayerFromDatabaseSession(request: Request) {
    const session = await getSession(request.headers.get("Cookie"));
    return await getPlayerById(session.get("player").id);
}

export async function changePlayer(request: Request, playerToken: PlayerToken) {
    const session = await getSession(request.headers.get("Cookie"));
    const player = await getPlayerById(playerToken.playerId);
    await setSession(session, playerToken, player!);
    return redirect(`/application/games/${playerToken.gameId}`);
}

export async function authenticatePlayer(
    params: Params,
    request: Request
): Promise<UserAuthentication> {
    let isAuthenticated = false;
    const { gameToken } = getCommonSearchParameters(request);
    const { gameId } = getCommonParameters(params, false);
    const session = await getSession(request.headers.get("Cookie"));
    console.log(session.id);
    prepareSession(session);
    let isFirstAuthentication = false;
    if (!!gameToken && !sessionHasGameToken(session, gameId)) {
        const { tokenMatches, player, playerToken } = await verifyToken(
            gameId,
            decryptPlayerToken(gameToken)
        );
        isAuthenticated = tokenMatches;
        let cookieHeader;
        if (tokenMatches && playerToken) {
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
    } else if (sessionHasGameToken(session, gameId)) {
        if (!!gameToken) {
            throw redirect(`/application/change?token=${gameToken}`);
        }
        const playerToken = findGameTokenFromSession(session, gameId);
        const { tokenMatches, player } = await verifyToken(
            gameId,
            playerToken!
        );
        isAuthenticated = tokenMatches;
        const cookieHeader = await commitSession(session);
        return {
            isAuthenticated,
            session,
            cookieHeader,
            player,
            isFirstAuthentication,
        };
    } else if (sessionHasPlayer(session)) {
        const player = await getPlayerById(session.get("player").id);
        return {
            isAuthenticated,
            session,
            cookieHeader: "",
            player,
            isFirstAuthentication,
        };
    } else
        return {
            isAuthenticated,
            session,
            cookieHeader: "",
            player: null,
            isFirstAuthentication,
        };
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
    let token = session.get("token");
    token[playerToken.gameId] = playerToken;
    session.set("token", token);
    if (player) {
        session.set("player", player);
    }
    return await commitSession(session);
}

function sessionHasGameToken(session: Session, gameId: string) {
    console.log(session.data);
    return !!session.get("token")[gameId];
}

function sessionHasPlayer(session: Session) {
    return !!session.get("player");
}

function findGameTokenFromSession(
    session: Session,
    gameId: string
): PlayerToken | null {
    const token = session.get("token");
    return token[gameId];
}

function prepareSession(session: Session) {
    if (!session.has("token")) {
        session.set("token", {});
    }
}
