import {useMatchesData} from "~/utils";
import {GameWithFeedback} from "~/config/applicationTypes";
import {Game, GameAction} from "@prisma/client";

type AdminGameData = {
    games: Game[] | undefined,
    actions: GameAction[] | undefined
}

function isGameWithFeedback(game: any): game is GameWithFeedback {
    return game && typeof game === "object" && typeof game.spielort === "string" && game.hasOwnProperty('feedback');
}

function isGameAction(value: any): value is GameAction {
    return value && typeof value === "object" && value.hasOwnProperty('actionType');
}

function isGameArray(value: any): value is Game[] {
    return Array.isArray(value) && (value.length === 0 || value[0].hasOwnProperty('spielort'))
}

function isGameActionArray(value: any): value is GameAction[] {
    return Array.isArray(value) && (value.length === 0 || isGameAction(value[0]))
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
    const actions = isGameActionArray(data?.actions) ? data?.actions : undefined
    return {games: games, actions: actions}
}

export function useAdminGameData(): AdminGameData {
    const maybeGameData = useOptionalAdminGameData();
    if (!maybeGameData.games) {
        throw new Error(maybeErrorMessage('admin game data.games', 'admin games loader'));
    }
    if (!maybeGameData.actions) {
        throw new Error(maybeErrorMessage('admin game data.actions', 'admin games loader'));
    }
    return maybeGameData
}

const maybeErrorMessage = (valueName: string, loaderName: string) => `No "${valueName}" defined found in "${loaderName}" loader`