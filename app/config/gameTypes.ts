import {Feedback, Game, Player} from "@prisma/client";

export type FeedBackWithPlayer = Feedback & {
    player: Player;
};

export interface GameWithFeedback extends Game {
    feedback: FeedBackWithPlayer[];
}