import {json, LoaderFunction, redirect} from "@remix-run/node";
import {authenticatePlayer} from "~/utils/session.server";
import routeLinks from "~/helpers/constants/routeLinks";
import {getGameById, getMostRecentGame} from "~/models/games.server";
import {Player} from "@prisma/client";
import {GameWithFeedback} from "~/config/gameTypes";
import {useDateTime} from "~/utils";

export type NavbarLoaderData = {
    isAuthenticated: boolean;
    player: Player;
    nextGame: GameWithFeedback | null;
    id: string
};


export const loader: LoaderFunction = async ({params, request}) => {
    const {isAuthenticated, player} = await authenticatePlayer(params, request);
    if (!player) {
        return redirect(routeLinks.playerNotAuthenticated);
    }
    const nextGame = await getMostRecentGame();
    const nextGameWithFeedBack = !!nextGame ? await getGameById(nextGame.id) : null

    return json<NavbarLoaderData>({
        id: useDateTime(new Date()),
        isAuthenticated,
        player,
        nextGame: nextGameWithFeedBack,
    });
};

const NavbarData = () => {
    return (
        <div>Nothing here</div>
    )
}

export default NavbarData