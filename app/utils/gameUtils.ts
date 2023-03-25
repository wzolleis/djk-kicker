import {useMatchesData} from "~/utils";
import {GameWithFeedback} from "~/config/applicationTypes";
import {Game} from "@prisma/client";

type AdminGameData = {
    games: Game[] | undefined,
}

function isGameWithFeedback(game: any): game is GameWithFeedback {
    return game && typeof game === "object" && typeof game.spielort === "string" && game.hasOwnProperty('feedback');
}

function isGameArray(value: any): value is Game[] {
    return Array.isArray(value) && (value.length === 0 || value[0].hasOwnProperty('spielort'))
}

export function useOptionalNextGame(): GameWithFeedback | undefined {
    const data = useMatchesData("root");
    if (!data || !isGameWithFeedback(data.nextGame)) {
        return undefined;
    }
    return data.nextGame;
}

export function useNextGame(): GameWithFeedback {
    const maybeGame = useOptionalNextGame();
    if (!maybeGame) {
        throw new Error(maybeErrorMessage('game', 'root loader'));
    }
    return maybeGame;
}

export function useOptionalAdminGameData(): AdminGameData {
    const data = useMatchesData("routes/application/admin/games");
    const games = isGameArray(data?.games) ? data?.games : undefined
    return {games: games}
}

export function useAdminGameData(): AdminGameData {
    const maybeGameData = useOptionalAdminGameData();
    if (!maybeGameData.games) {
        throw new Error(maybeErrorMessage('admin game data.games', 'admin games loader'));
    }
    return maybeGameData
}

const maybeErrorMessage = (valueName: string, loaderName: string) => `No "${valueName}" defined found in "${loaderName}" loader`