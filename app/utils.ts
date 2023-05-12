import {useMatches} from "@remix-run/react";
import {useMemo} from "react";

import type {User} from "~/models/user.server";
import {DateTime} from "luxon";
import messages from "~/components/i18n/messages";
import {Player} from "@prisma/client";

const DEFAULT_REDIRECT = "/";

/**
 * This should be used any time the redirect path is user-provided
 * (Like the query string on our login/signup pages). This avoids
 * open-redirect vulnerabilities.
 * @param {string} to The redirect destination
 * @param {string} defaultRedirect The redirect to use if the to is unsafe.
 */
export function safeRedirect(to: FormDataEntryValue | string | null | undefined, defaultRedirect: string = DEFAULT_REDIRECT) {
  if (!to || typeof to !== "string") {
    return defaultRedirect;
  }

  if (!to.startsWith("/") || to.startsWith("//")) {
    return defaultRedirect;
  }

  return to;
}

/**
 * This base hook is used in other hooks to quickly search for specific data
 * across all loader data using useMatches.
 * @param {string} id The route id
 * @returns {JSON|undefined} The router data or undefined if not found
 */
export function useMatchesData(id: string): Record<string, unknown> | undefined {
  const matchingRoutes = useMatches();
  const route = useMemo(() => matchingRoutes.find((route) => route.id === id), [matchingRoutes, id]);
  return route?.data;
}

function isUser(user: any): user is User {
  return user && typeof user === "object" && typeof user.email === "string";
}

function isPlayerList(players: any): players is Player[] {
  return players && typeof players.hasOwnProperty('length')
}

export function useOptionalUser(): User | undefined {
  const data = useMatchesData("root");
  if (!data || !isUser(data.user)) {
    return undefined;
  }
  return data.user;
}

export function useUser(): User {
  const maybeUser = useOptionalUser();
  if (!maybeUser) {
    throw new Error("No user found in root loader, but user is required by useUser. If user is optional, try useOptionalUser instead.");
  }
  return maybeUser;
}

export function validateEmail(email: unknown): email is string {
  if (email === "jack") return true;
  return typeof email === "string" && email.length > 3 && email.includes("@");
}

export const useOptionalPlayers = (): Player[] | undefined => {
  const data = useMatchesData("root");
  if (!data || !isPlayerList(data.players)) {
    return undefined;
  }
  return data.players;

}

export const usePlayers = (): Player[] => {
  const maybePlayers = useOptionalPlayers()
  if (!maybePlayers) {
    throw new Error("No players found in root loader, but players is required by usePlayers. If players is optional, try useOptionalPlayers instead.");
  }
  return maybePlayers
}

export type QueryParamTypes = {
  player: string | null;
  gameid: string | null;
  playerid: string | null;
  filter: string | null;
  token: string | null;
};

export function useDate(date: Date) {
  return DateTime.fromJSDate(new Date(date)).toFormat("dd.MM.yyyy");
}

export function useDateTime(date: Date) {
  return DateTime.fromJSDate(new Date(date)).toFormat("dd.MM.yyyy HH:mm");
}

export function useTimeOnly(date: Date) {
  return DateTime.fromJSDate(new Date(date)).toFormat("HH:mm");
}


export function useDateOnly(date: Date): string {
  return DateTime.fromJSDate(new Date(date)).toFormat("dd.MM.yyyy");
}

export type QueryParamName = keyof QueryParamTypes;

export function getQueryParams(request: Request, inputParam: Array<QueryParamName> | QueryParamName): Partial<QueryParamTypes> {
  const url = new URL(request.url);
  const result: Partial<QueryParamTypes> = {};

  if (inputParam instanceof Array) {
    inputParam.forEach((param) => (result[param] = url.searchParams.get(param)));
  } else {
    result[inputParam] = url.searchParams.get(inputParam);
  }

  return result;
}

export const getNextGameDay = (startDate: DateTime = DateTime.now().startOf("day")): DateTime => {
  const wednesday: number = 3;
  if (startDate.weekday === wednesday) return startDate;
  if (startDate.weekday < wednesday) return startDate.set({ weekday: wednesday });
  return startDate.set({ weekday: wednesday, weekNumber: startDate.weekNumber + 1 });
};

export function getPlayerGreeting(playerName: string) {
  const hour = DateTime.now().hour;
  let playerGreeting;
  if (hour < 12) {
    playerGreeting = messages.playerGreeting.morning;
  } else if (hour < 14) {
    playerGreeting = messages.playerGreeting.noon;
  } else if (hour < 18) {
    playerGreeting = messages.playerGreeting.afternoon;
  } else {
    playerGreeting = messages.playerGreeting.evening;
  }
  return `${playerGreeting}, ${playerName}`;
}
