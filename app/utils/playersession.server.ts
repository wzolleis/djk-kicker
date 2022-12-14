import {createSession, destroySession, getSession} from "~/utils/session.server";
import {DateTime} from "luxon";
import {getPlayerById} from "~/models/player.server";
import type {Params} from "react-router";

export async function claimPlayer(playerId: string, params: Params, request: Request) {
    const player = await getPlayerById(playerId);
    if (!player) {
        throw new Error('Player not found');
    }
    const {getSession, commitSession, destroySession} = createSession(
        `player-session-${playerId}`,
        DateTime.now().plus({weeks: 4}).toJSDate()
    );
    const session = await getSession(request.headers.get('Cookie'));
    session.set('playerId', playerId);
    session.set("playerName", player.name);
    const cookieHeader = await commitSession(session);
    return {cookieHeader, session}
}
