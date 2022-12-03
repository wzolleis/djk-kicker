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
import GamesList from "~/components/game/admin/GamesList";

type LoaderData = {
    games: Awaited<ReturnType<typeof readGames>>;
};

export const loader = async ({request}: LoaderArgs) => {
    await requireUserId(request);

    const games = await readGames();
    return json<LoaderData>({games});
};

const isOldGame = (game: Game): boolean =>
    !!game.gameTime && new Date() > new Date(game.gameTime);

const Games = () => {
    const {games} = useLoaderData() as unknown as LoaderData;

    return (
        <>
            <main className={"space-y-4"}>
                <div className={"flex justify-between"}>
                    <PageHeader title={messages.appmenu.games}/>
                    <Link to={"new"}>
                        <DefaultButton>
                            <img className={"h-6"} src="/img/icons/add.png" alt=""/>
                            {messages.adminGamesForm.new}
                        </DefaultButton>
                    </Link>
                </div>
                <GamesList games={games}></GamesList>
            </main>
            <Outlet></Outlet>
        </>
    );
};

export default Games;
