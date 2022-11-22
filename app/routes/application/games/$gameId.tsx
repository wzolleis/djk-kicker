import {Outlet} from "@remix-run/react";
import {Feedback, Game, Player, Prisma} from "@prisma/client";

export type FeedBackWithPlayer = Feedback & {
    player: Player
}

export interface GameWithFeedback extends Game {
    feedback: FeedBackWithPlayer[]
}

export type GameWithFeedback2 = Prisma.GameGetPayload<{
    include: {
        feedback: {
            include: {
                player: true;
            };
        };
    };
}>;


export default function Games() {


    return (
        <div className="flex flex-col gap-5">
            <Outlet></Outlet>
        </div>
    );

}