import {findAllGames} from "~/models/admin.games.server";
import type {LoaderArgs} from "@remix-run/node";
import {json} from "@remix-run/node";
import {requireUserId} from "~/session.server";
import {Link, NavLink, Outlet, useLoaderData} from "@remix-run/react";
import messages from "~/components/i18n/messages";
import PageHeader from "~/components/common/PageHeader";
import DefaultButton from "~/components/common/buttons/DefaultButton";
import GamesList from "~/components/game/admin/GamesList";
import RedButton from "~/components/common/buttons/RedButton";

type LoaderData = {
    games: Awaited<ReturnType<typeof findAllGames>>;
};

export const loader = async ({request}: LoaderArgs) => {
    await requireUserId(request);

    const games = await findAllGames();
    return json<LoaderData>({games});
};

const Games = () => {
    const {games} = useLoaderData() as unknown as LoaderData;

    return (
        <>
            <main className={"space-y-4"}>
                <div className={"flex justify-between items-center"}>
                    <PageHeader title={messages.appmenu.games}/>
                    <div className={'flex flex-col md:flex-row gap-2 ml-auto'}>
                        <NavLink to={"deleteExpired"}>
                            <RedButton>
                                <p className={'md:h6 fa fa-trash'}/>
                                {messages.adminGamesForm.deleteExpired}
                            </RedButton>
                        </NavLink>
                        <Link to={"new"}>
                            <DefaultButton>
                                <p className={'md:h6 fa fa-plus'}/>
                                {messages.adminGamesForm.new}
                            </DefaultButton>
                        </Link>
                    </div>
                </div>
                <GamesList games={games}></GamesList>
            </main>
            <Outlet/>
        </>
    );
};

export default Games;
