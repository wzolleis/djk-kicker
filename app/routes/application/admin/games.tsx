import {Outlet} from "@remix-run/react";
import {findAllGames} from "~/models/admin.games.server";
import {json, LoaderArgs} from "@remix-run/node";
import {requireUserId} from "~/session.server";

type LoaderData = {
    games: Awaited<ReturnType<typeof findAllGames>>
};

export const loader = async ({request}: LoaderArgs) => {
    await requireUserId(request);
    const games = await findAllGames();
    return json<LoaderData>({games});
};

const Games = () => {
    return (
        <Outlet></Outlet>
    )
};

export default Games;
