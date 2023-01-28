import {Outlet} from "@remix-run/react";
import {findAllGames} from "~/models/admin.games.server";
import {json, LoaderArgs} from "@remix-run/node";
import {requireUserId} from "~/session.server";
import {findAllGameActions} from "~/models/gameActions.server";

type LoaderData = {
    games: Awaited<ReturnType<typeof findAllGames>>
    actions: Awaited<ReturnType<typeof findAllGameActions>>
};

export const loader = async ({request}: LoaderArgs) => {
    await requireUserId(request);
    const games = await findAllGames();
    const actions = await findAllGameActions()
    return json<LoaderData>({games, actions: actions});
};

const Games = () => {
    return (
        <Outlet></Outlet>
    )
};

export default Games;
