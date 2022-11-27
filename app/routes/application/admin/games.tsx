import {readGames} from "~/models/admin.games.server";
import type {LoaderArgs} from "@remix-run/node";
import {json} from "@remix-run/node";
import {requireUserId} from "~/session.server";
import {Link, Outlet, useLoaderData} from "@remix-run/react";
import messages from "~/components/i18n/messages";
import type {Game} from "@prisma/client";
import GameCard from "~/components/game/GameCard";
import PageHeader from "~/components/common/PageHeader";
import DefaultButton from "~/components/common/buttons/DefaultButton";
import GamesTableRow from "~/components/tables/admin/games/GamesTableRow";
import GamesTable from "~/components/tables/admin/games/GamesTable";

type LoaderData = {
    games: Awaited<ReturnType<typeof readGames>>
}

export const loader = async ({request}: LoaderArgs) => {
    await requireUserId(request);

    const games = await readGames()
    return json<LoaderData>({games});
};

const isOldGame = (game: Game): boolean => !!game.gameTime && (new Date() > new Date(game.gameTime));

const GameList = ({games}: { games: Game[] }) => {
    return (
        <>
            <main className={"space-y-4"}>
                <div className={"flex justify-between"}>
                    <PageHeader title={messages.appmenu.games}/>
                    <DefaultButton><Link to={"new"}>{messages.adminGamesForm.new}</Link></DefaultButton>
                </div>
                <GamesTable games={games}/>
            </main>
        </>
    );
};

const Games = () => {
    const {games} = useLoaderData() as unknown as LoaderData;

    return (
        <>
            <section className={"flex flex-col gap-4"}>
                <GameList games={games}/>
                <Outlet/>
            </section>
        </>
    );
};

export default Games;