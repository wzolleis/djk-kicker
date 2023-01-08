import {DefaultFeedback, Feedback, Game, Player} from "@prisma/client";
import {Session} from "@remix-run/node";

export type FeedBackWithPlayer = Feedback & {
    player: Player;
};

export interface GameWithFeedback extends Game {
    feedback: FeedBackWithPlayer[];
}

export type UserAuthentication = {
    isAuthenticated: boolean;
    session?: Session;
    cookieHeader: string;
    player?: Player | null;
    isFirstAuthentication: boolean;
};

export const isUserAuthentication = (userAuthentication: any): userAuthentication is UserAuthentication => {
    return userAuthentication && typeof userAuthentication === "object" && typeof userAuthentication.cookieHeader === "string";
}

export const isDefaultFeedback = (defaultFeedback: any): defaultFeedback is DefaultFeedback => {
    return defaultFeedback && typeof defaultFeedback === 'object' && typeof defaultFeedback.playerId === "string"
}
export type MailType = 'GAME_INVITATION' | 'GAME_ZUSAGE' | 'GAME_ABSAGE'
export type ActionType = 'GAME_INVITATION' | 'GAME_ZUSAGE' | 'GAME_ABSAGE'