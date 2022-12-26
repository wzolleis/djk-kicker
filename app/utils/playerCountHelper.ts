import {configuration} from "~/config";
import {statusInConfig} from "~/config/status";
import {GameWithFeedback} from "~/config/gameTypes";

const add = (playerCount: number): number => {
    return playerCount + 1
}

const subtract = (playerCount: number): number => {
    const next = playerCount - 1
    return next >= 1 ? next : 1
}

export const calculateCompleteNumberOfPlayers = (game: GameWithFeedback) => {
    let confirmedPlayerCount = 0;
    game.feedback.forEach((feedback) => {
        if (feedback.status === configuration.status.confirmed) {
            confirmedPlayerCount = confirmedPlayerCount + feedback.playerCount
        }
    });
    return confirmedPlayerCount
}
export const calculateNumberOfPlayerWithStatus = (game: GameWithFeedback, status: statusInConfig) => {
    let playerCount = 0;
    game.feedback.forEach((feedback) => {
        if (feedback.status === status) {
            playerCount++
        }
    });

    return playerCount
}


export default {
    add, subtract
}