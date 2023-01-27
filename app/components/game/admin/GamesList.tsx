import {Game} from "@prisma/client";
import {useDateTime} from "~/utils";
import classNames from "classnames";
import messages from "~/components/i18n/messages";
import {NavLink} from "@remix-run/react";
import routeLinks from "~/config/routeLinks";

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
                        <div  className="bg-blue-200" key={game.id}>
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

    export default GamesList;