import {findAllGames} from "~/models/admin.games.server";
import type {LoaderArgs} from "@remix-run/node";
import {json} from "@remix-run/node";
import {requireUserId} from "~/session.server";
import {NavLink, Outlet, useLoaderData} from "@remix-run/react";
import messages from "~/components/i18n/messages";
import PageHeader from "~/components/common/PageHeader";
import GamesList from "~/components/game/admin/GamesList";
import ContentContainer from "~/components/common/container/ContentContainer";

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
        <ContentContainer className={"mt-5"}>
            <main className={"space-y-4"}>
                <div className={"flex justify-between items-center bg-blue-400"}>
                    <PageHeader title={messages.appmenu.games}/>
                    <div className="md:px-3 text-lg text-gray-600 flex">
                        <NavLink to={"deleteExpired"}>
                            <button
                                className="ml-auto p-3 text-slate-800 hover:text-blue-600 text-sm bg-white hover:bg-slate-100 border border-slate-200 font-small md:font-medium px-4 py-2 inline-flex space-x-1 items-center">
                                <i className={"fa fa-trash"}/>
                                <span className={"hidden lg:inline px-1"}>{messages.adminGamesForm.deleteExpired}</span>
                            </button>
                        </NavLink>

                        <NavLink to={"new"}>
                            <button
                                className="ml-auto p-3 text-slate-800 hover:text-blue-600 text-sm bg-white hover:bg-slate-100 border border-slate-200 font-small md:font-medium px-4 py-2 inline-flex space-x-1 items-center">
                                <i className={"fa fa-plus"}/>
                                <span className={"hidden lg:inline px-1"}>{messages.adminGamesForm.new}</span>
                            </button>
                        </NavLink>
                    </div>
                </div>
                <GamesList games={games}></GamesList>
            </main>
            <Outlet/>
        </ContentContainer>
    );
};

export default Games;
