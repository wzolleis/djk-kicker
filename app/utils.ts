import {useMatches} from "@remix-run/react";
import {useMemo} from "react";

import type {User} from "~/models/user.server";
import {DateTime} from "luxon";
import {EnumParams} from "ajv";

const DEFAULT_REDIRECT = "/";

/**
 * This should be used any time the redirect path is user-provided
 * (Like the query string on our login/signup pages). This avoids
 * open-redirect vulnerabilities.
 * @param {string} to The redirect destination
 * @param {string} defaultRedirect The redirect to use if the to is unsafe.
 */
export function safeRedirect(
    to: FormDataEntryValue | string | null | undefined,
    defaultRedirect: string = DEFAULT_REDIRECT
) {
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
export function useMatchesData(
    id: string
): Record<string, unknown> | undefined {
    const matchingRoutes = useMatches();
    const route = useMemo(
        () => matchingRoutes.find((route) => route.id === id),
        [matchingRoutes, id]
    );
    return route?.data;
}

function isUser(user: any): user is User {
    return user && typeof user === "object" && typeof user.email === "string";
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
        throw new Error(
            "No user found in root loader, but user is required by useUser. If user is optional, try useOptionalUser instead."
        );
    }
    return maybeUser;
}

export function validateEmail(email: unknown): email is string {
    if (email === "jack") return true;
    return typeof email === "string" && email.length > 3 && email.includes("@");
}

export function useDate(date: Date): string {
    if (date === null) {
        return "Unbekannt";
    }
    const parsedDate = new Date(date);
    return `${parsedDate.getDate()}.${
        parsedDate.getMonth() + 1
    }.${parsedDate.getFullYear()}`;
}

/**
 * Wandelt den Input-Value eines datetime-local Input-Feldes in ein JS-Date
 * @param dateTime Der Wert des datetime-local Input als ISO-String
 */
export const dateTimeLocalInputValueToDateTime = (dateTime: string): DateTime =>
    DateTime.fromISO(dateTime);

/**
 * Wandelt den DateTime in einen String, der als Default-Wert in einem datetime-local verwendet werden kann
 * @param dateTime ein DateTime (luxon) Wert, ist etwas allgemeiner verwendbar als das normale JS-Date
 */
export const dateTimeToDateTimeLocalInputFormValue = (dateTime: DateTime) => {
    return `${dateTime.toFormat("yyyy-MM-dd")}T${dateTime.toFormat("T")}`;
};

export type QueryParamTypes = {
    player: string | null,
    gameid: string | null,
    filter: string | null,
    token: string | null
}

export type QueryParamName = keyof QueryParamTypes


export function getQueryParams(request: Request, inputParam: Array<QueryParamName> | QueryParamName): Partial<QueryParamTypes> {
    const url = new URL(request.url);
    const result: Partial<QueryParamTypes> = {}

    if (inputParam instanceof Array) {
        inputParam.forEach(param => result[param] = url.searchParams.get(param))
    } else {
        result[inputParam] = url.searchParams.get(inputParam)
    }

    return result
}


export function getNextGameDay() {
    const wednesday: number = 3;
    const now = DateTime.now().set({hour: 0, minute: 55})

    const today: number = now.weekday;
    let gameDay

    if (today < wednesday) {
        gameDay = now.set({
            weekday: wednesday
        })
    } else {
        gameDay = now.plus({weeks: 1}).set({
            weekday: wednesday
        })
    }

    // if (today < wednesday) {
    //     gameDay = DateTime.now().plus({
    //         days: wednesday - today
    //     })
    // } else if (today > wednesday) {
    //     gameDay = DateTime.now().plus({
    //         weeks: 1,
    //     })
    // }


    console.log('gameday = ', gameDay.toJSDate())

    return gameDay


}

export function getRedactedString(): string {
    const redacted = '●'
    let result = redacted;
    for (let i = 0; i < 10; i++) {
        result += redacted;
    }
    return result;
}
