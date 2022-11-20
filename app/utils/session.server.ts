import type {Session} from "@remix-run/node";
import {
    createCookieSessionStorage,
} from "@remix-run/node";
import {checkToken} from "~/utils/token.server";
import type {Params} from "react-router";

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
    throw new Error("SESSION_SECRET must be set");
}

export const {getSession, commitSession, destroySession} = createCookieSessionStorage({
    cookie: {
        name: "token-session",
        secure: process.env.ENVIRONMENT === "production",
        secrets: [sessionSecret],
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
        httpOnly: true,
    },
});

export type UserAuthentication =
    {
        isAuthenticated: boolean,
        session?: Session,
        cookieHeader: string
    }


export async function authenticateUser(params: Params, request: Request): Promise<UserAuthentication> {
    let isAuthenticated = false;
    const url = new URL(request.url);
    const gameId = params.gameId!
    const tokenFromLink = url.searchParams.get("token") ? url.searchParams.get("token") : null;
    const session = await getSession(request.headers.get('Cookie'));
    if (tokenFromLink && await checkToken(gameId, tokenFromLink)) {
        session.set(gameId, tokenFromLink);
        isAuthenticated = true;
    }
    if (session.has(gameId)) {
        isAuthenticated = await checkToken(gameId, session.get(gameId));
    }
    const cookieHeader = await commitSession(session);
    return {isAuthenticated, session, cookieHeader}

}

