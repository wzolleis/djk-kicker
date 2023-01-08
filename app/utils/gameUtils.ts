import {useMatchesData} from "~/utils";
import {GameWithFeedback} from "~/config/applicationTypes";

function isGame(game: any): game is GameWithFeedback {
    return game && typeof game === "object" && typeof game.spielort === "string" && game.hasOwnProperty('feedback');
}

export function useOptionalNextGame(): GameWithFeedback | undefined {
    const data = useMatchesData("root");
    if (!data || !isGame(data.nextGame)) {
        return undefined;
    }
    return data.nextGame;
}

export function useNextGame(): GameWithFeedback {
    const maybeGame = useOptionalNextGame();
    if (!maybeGame) {
        throw new Error("No game defined found in root loader, but game is required by useGame. If game is optional, try useOptionalGame instead.");
    }
    return maybeGame;
}