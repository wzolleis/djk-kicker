import type { Session } from "@remix-run/node";
import { createCookieSessionStorage } from "@remix-run/node";
import { checkToken, decryptPlayerToken } from "~/utils/token.server";
import type { Params } from "react-router";
import { Player } from "@prisma/client";
import { PlayerSession } from "~/models/classes/PlayerSession";
import { getPlayerById } from "~/models/player.server";

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set");
}

export const { getSession, commitSession, destroySession } = createCookieSessionStorage({
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

export type UserAuthentication = {
  isAuthenticated: boolean;
  session?: Session;
  cookieHeader: string;
  player?: Player | null;
  isFirstAuthentication: boolean;
};

export async function authenticatePlayer(params: Params, request: Request): Promise<UserAuthentication> {
  let isAuthenticated = false;
  const url = new URL(request.url);
  const gameId = params.gameId!;
  let player;
  const providedToken = url.searchParams.get("token") ? url.searchParams.get("token") : null;
  const session = await getSession(request.headers.get("Cookie"));
  let isFirstAuthentication = false;

  if (providedToken) {
    const decryptedToken = decryptPlayerToken(providedToken);
    isAuthenticated = await checkToken(gameId, decryptedToken.gameToken);
    player = await getPlayerById(decryptedToken.playerId);
    let playerSession: PlayerSession = session.get("playerSession");
    const newGameToken = {
      [gameId]: decryptedToken.gameToken,
    };
    if (playerSession) {
      const gameTokens = playerSession.gameTokens;
      gameTokens.push(newGameToken);
    } else {
      const gameTokens = [newGameToken];
      playerSession = new PlayerSession(player!, gameTokens);
    }
    session.set("playerSession", playerSession);
    isFirstAuthentication = true;
  }

  if (session.has("playerSession")) {
    const playerSession: PlayerSession = session.get("playerSession");
    const gameTokenObject = playerSession.gameTokens.find((object) => {
      return object.hasOwnProperty(gameId);
    });
    if (gameTokenObject) {
      const gameToken = gameTokenObject[gameId];
      if (gameToken) {
        isAuthenticated = await checkToken(gameId, gameToken);
      }
    }
    player = playerSession.player;
  }
  const cookieHeader = await commitSession(session);
  return { isAuthenticated, session, cookieHeader, player, isFirstAuthentication };
}

export async function getPlayerFromSession(request: Request): Promise<Player | null> {
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.has("playerSession")) {
    return null;
  }
  return session.get("playerSession");
}
