import {configuration} from "~/config";
import {statusInConfig} from "~/config/status";
import {GameWithFeedback} from "~/config/applicationTypes";

const add = (playerCount: number): number => {
    return playerCount + 1
}

const subtract = (playerCount: number): number => {
    const next = playerCount - 1
    return next >= 0 ? next : 0
}

export const calculateCompleteNumberOfPlayers = (game: GameWithFeedback) => {
    return calculateNumberOfGuests(game) + calculateConfirmedPlayer(game)
}

export const calculateNumberOfGuests = (game: GameWithFeedback) => {
    let confirmedPlayerCount = 0;
    game.feedback.forEach((feedback) => {
        if (feedback.status === configuration.status.confirmed) {
            confirmedPlayerCount = feedback.playerCount + 1
        }
    });
    return confirmedPlayerCount
}

export const calculateConfirmedPlayer = (game: GameWithFeedback) => {
    let confirmedPlayerCount = 0;
    game.feedback.forEach((feedback) => {
        if (feedback.status === configuration.status.confirmed) {
            confirmedPlayerCount = confirmedPlayerCount + 1
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