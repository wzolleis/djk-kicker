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
            <main className={""}>
                <div className={"flex justify-between"}>
                    <PageHeader title={messages.appmenu.games}/>
                    <DefaultButton><Link to={"new"}>{messages.adminGamesForm.new}</Link></DefaultButton>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 py-5">
                    {games.map((game) => <GameCard key={game.id} game={game}/>)}
                </div>
            </main>
        </>
    );
};

const Games = () => {
    const {games} = useLoaderData() as unknown as LoaderData;

    return (
        <>
            <section className={"flex gap-4"}>
            <GameList games={games}/>
            <Outlet/>
            </section>
        </>
    );
};

export default Games;