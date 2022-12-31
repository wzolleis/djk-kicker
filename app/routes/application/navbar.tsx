import {json, LoaderFunction} from "@remix-run/node";
import {authenticatePlayer} from "~/utils/session.server";
import {getGameById, getMostRecentGame} from "~/models/games.server";
import {DefaultFeedback, Player} from "@prisma/client";
import {GameWithFeedback} from "~/config/gameTypes";
import {getDefaultFeedback} from "~/models/feedback.server";

export type NavbarLoaderData = {
    isAuthenticated: boolean;
    player?: Player
    nextGame?: GameWithFeedback;
    defaultFeedback?: DefaultFeedback
};


export const loader: LoaderFunction = async ({params, request}) => {
    const {isAuthenticated, player} = await authenticatePlayer(params, request);
    const nextGame = await getMostRecentGame();
    const nextGameWithFeedBack = !!nextGame ? await getGameById(nextGame.id) : undefined
    const defaultFeedback = player?.id ? await getDefaultFeedback(player?.id) : undefined

    return json<NavbarLoaderData>({
        isAuthenticated,
        player: player ?? undefined,
        defaultFeedback,
        nextGame: nextGameWithFeedBack ?? undefined
    });
};

const NavbarData = () => {
    return (
        <div>Nothing here</div>
    )
}

export default NavbarData