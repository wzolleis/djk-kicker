import {findAllGames} from "~/models/admin.games.server";
import type {LoaderArgs} from "@remix-run/node";
import {json} from "@remix-run/node";
import {requireUserId} from "~/session.server";
import {NavLink, Outlet, useLoaderData} from "@remix-run/react";
import messages from "~/components/i18n/messages";
import PageHeader from "~/components/common/PageHeader";
import ContentContainer from "~/components/common/container/ContentContainer";
import {Game} from "@prisma/client";
import {useDateTime} from "~/utils";
import routeLinks from "~/config/routeLinks";
import classNames from "classnames";

type LoaderData = {
    games: Awaited<ReturnType<typeof findAllGames>>;
};

export const loader = async ({request}: LoaderArgs) => {
    await requireUserId(request);

    const games = await findAllGames();
    return json<LoaderData>({games});
};

type GamesListProps = {
    games: Game[];
}

const GamesList = ({games}: GamesListProps) => {
    return (
        <div className={"w-full space-y-3"}>
            {
                games.map((game) => {
                    const gameStatusClasses = {
                        'text-red-500': !!game.status && game.status === 'Absage',
                        'text-green-500': !!game.status && game.status === 'Zusage',
                    }

                    return (
                        <div className="bg-blue-200" key={game.id}>
                            <div className="h-50 rounded-lg">
                                <div className="flex items-center justify-between border-b" data-testid={"game-card-testid"}>
                                    <div
                                        className="p-3 text-gray-700 text-lg font-bold">{`${game.name || 'Spiel'} am ${useDateTime(game.gameTime)}`}</div>
                                    <div className="p-3 flex">
                                        <button
                                            className="text-slate-800 hover:scale-110 text-sm bg-white hover:bg-slate-100 border border-slate-200 rounded-l-lg font-small md:font-medium px-4 py-2 inline-flex space-x-1 items-center">
                                            <i className={"fa fa-edit mx-1"}/>
                                            <span className={"hidden lg:inline px-1"}>{messages.buttons.edit}</span>
                                        </button>
                                        <NavLink to={`${routeLinks.admin.game.delete(game.id)}`}>
                                            <button
                                                className="text-slate-800 hover:text-blue-600 text-sm bg-white hover:bg-slate-100 border border-slate-200 rounded-r-lg font-small md:font-medium px-4 py-2 inline-flex space-x-1 items-center">
                                                <i className={"fa fa-trash mx-1"}/>
                                                <span className={"hidden lg:inline"}>{messages.buttons.delete}</span>
                                            </button>
                                        </NavLink>
                                    </div>
                                </div>
                                <div className={classNames("p-3 text-lg", gameStatusClasses)}>
                                    {game.status ?? "Noch kein Status"}
                                </div>
                                <div className="p-3 border-t text-lg">
                                    <div className="flex">
                                        <NavLink className={"ml-auto "} to={`${game.id}/invite`}>
                                            <button
                                                className="p-3 text-slate-800 hover:text-blue-600 text-sm bg-white hover:bg-slate-100 border border-slate-200 font-small md:font-medium px-4 py-2 inline-flex space-x-1 items-center rounded-l-lg">
                                                <i className={"fa fa-envelope"}/>
                                                <span className={"hidden lg:inline px-1"}>{messages.buttons.invite}</span>
                                            </button>
                                        </NavLink>
                                        <NavLink to={`${game.id}/zusage`}>
                                            <button
                                                className="text-slate-800 hover:text-blue-600 text-sm bg-white hover:bg-slate-100 border border-slate-200  font-small md:font-mediumpx-4 py-2 inline-flex space-x-1 items-center">
                                                <i className={"fa-solid fa-thumbs-up mx-1 text-green-500 px-1 md:px-2"}/>
                                                <span className={"hidden lg:inline text-green-500 px-2"}>{messages.buttons.zusage}</span>
                                            </button>
                                        </NavLink>
                                        <NavLink to={`${game.id}/absage`}>
                                            <button
                                                className="text-slate-800 hover:text-blue-600 text-sm bg-white hover:bg-slate-100 border border-slate-200 font-small md:font-medium px-4 py-2 inline-flex space-x-1 items-center rounded-r-lg">
                                                <i className={"fa-solid fa-thumbs-down mx-1 text-red-500"}/>
                                                <span className={"hidden lg:inline text-red-500"}>{messages.buttons.absage}</span>
                                            </button>
                                        </NavLink>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}

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
