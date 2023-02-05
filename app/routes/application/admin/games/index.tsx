import {NavLink} from "@remix-run/react";
import messages from "~/components/i18n/messages";
import PageHeader from "~/components/common/PageHeader";
import ContentContainer from "~/components/common/container/ContentContainer";
import {Game, GameAction} from "@prisma/client";
import {useDateTime} from "~/utils";
import routeLinks from "~/config/routeLinks";
import classNames from "classnames";
import {ButtonIntent} from "~/config/action";
import {useAdminGameData} from "~/utils/gameUtils";

type GamesListProps = {
    games: Game[];
    actions: GameAction[]
}

type ButtonProps = {
    gameId: string
    intent: ButtonIntent
}

const InviteButton = ({gameId, intent}: ButtonProps) => {
    return (
        <NavLink className={"ml-auto"} to={`${gameId}/${intent}`}>
            <button
                className="p-3 text-slate-800 hover:text-blue-600 text-sm bg-white hover:bg-slate-100 border border-slate-200 font-small md:font-medium px-4 py-2 inline-flex space-x-1 items-center rounded-l-lg">
                <i className={"fa fa-envelope"}/>
                <span className={"hidden lg:inline px-1"}>{messages.buttons[intent]}</span>
            </button>
        </NavLink>
    )
}

const ZusageButton = ({gameId, intent}: ButtonProps) => {
    return (
        <NavLink to={`${gameId}/${intent}`}>
            <button
                className="text-slate-800 hover:text-blue-600 text-sm bg-white hover:bg-slate-100 border border-slate-200  font-small md:font-mediumpx-4 py-2 inline-flex space-x-1 items-center">
                <i className={"fa-solid fa-thumbs-up mx-1 text-green-500 px-1 md:px-2"}/>
                <span className={"hidden lg:inline text-green-500 px-2"}>{messages.buttons[intent]}</span>
            </button>
        </NavLink>
    )
}

const AbsageButton = ({gameId, intent}: ButtonProps) => {
    return (
        <NavLink to={`${gameId}/${intent}`}>
            <button
                className="text-slate-800 hover:text-blue-600 text-sm bg-white hover:bg-slate-100 border border-slate-200 font-small md:font-medium px-4 py-2 inline-flex space-x-1 items-center">
                <i className={"fa-solid fa-thumbs-down mx-1 text-red-500"}/>
                <span className={"hidden lg:inline text-red-500"}>{messages.buttons[intent]}</span>
            </button>
        </NavLink>
    )
}

const InviteAllButton = ({gameId, intent}: ButtonProps) => {
    return (
        <NavLink to={`${gameId}/${intent}`}>
            <button
                className="text-slate-800 hover:text-blue-600 text-sm bg-white hover:bg-slate-100 border border-slate-200 font-small md:font-medium px-4 py-2 inline-flex space-x-1 items-center rounded-r-lg">

                <i className={"fa-solid fa-envelopes-bulk mx-1 text-blue-500"}/>
                <span className={"hidden lg:inline text-blue-500"}>{messages.buttons[intent]}</span>
            </button>
        </NavLink>
    )
}

const EditGameButton = ({gameId, intent}: ButtonProps) => {
    return (
        <NavLink to={`${routeLinks.admin.game.edit(gameId)}`}>
            <button
                className="text-slate-800 hover:text-blue-600 text-sm bg-white hover:bg-slate-100 border border-slate-200 rounded-l-lg font-small md:font-medium px-4 py-2 inline-flex space-x-1 items-center">
                <i className={"fa fa-trash mx-1"}/>
                <span className={"hidden lg:inline"}>{messages.buttons[intent]}</span>
            </button>
        </NavLink>
    )
}

const DeleteGameButton = ({gameId, intent}: ButtonProps) => {
    return (
        <NavLink to={`${routeLinks.admin.game.delete(gameId)}`}>
            <button
                className="text-slate-800 hover:text-blue-600 text-sm bg-white hover:bg-slate-100 border border-slate-200 rounded-r-lg font-small md:font-medium px-4 py-2 inline-flex space-x-1 items-center">
                <i className={"fa fa-trash mx-1"}/>
                <span className={"hidden lg:inline"}>{messages.buttons[intent]}</span>
            </button>
        </NavLink>
    )
}

const GamesList = ({games, actions }: GamesListProps) => {
    return (
        <div className={"w-full space-y-3"}>
            {
                games.map((game) => {
                    const gameStatusClasses = {
                        'text-red-500': !!game.status && game.status === 'Absage',
                        'text-green-500': !!game.status && game.status === 'Zusage',
                    }

                    const gameActions = actions.filter(action => action.gameId === game.id).map(action => action.actionType).join(", ")

                    return (
                        <div className="bg-blue-200" key={game.id}>
                            <div className="h-50 rounded-lg">
                                <div className="flex items-center justify-between border-b" data-testid={"game-card-testid"}>
                                    <div
                                        className="p-3 text-gray-700 text-lg font-bold">{`${game.name || 'Spiel'} am ${useDateTime(game.gameTime)}`}</div>
                                    <div className="p-3 flex">
                                        <EditGameButton gameId={game.id} intent={"edit"}/>
                                        <DeleteGameButton gameId={game.id} intent={"edit"}/>
                                    </div>
                                </div>
                                <div className={classNames("p-3 text-lg", gameStatusClasses)}>
                                    {game.status ?? "Noch kein Status"}
                                </div>
                                <div className={classNames("p-3 text-lg inline-block w-96 md:w-fit", gameStatusClasses)}>
                                    <span className={"truncate text-ellipsis overflow-hidden block"}>{gameActions ?? "Noch kein Status"}</span>
                                </div>
                                <div className="p-3 border-t text-lg">
                                    <div className="flex">
                                        <InviteButton gameId={game.id} intent={"invite"}/>
                                        <ZusageButton gameId={game.id} intent={"zusage"}/>
                                        <AbsageButton gameId={game.id} intent={"absage"}/>
                                        <InviteAllButton gameId={game.id} intent={"inviteAll"}/>
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
    const {games, actions}= useAdminGameData()

    return (
        <ContentContainer className={"mt-5"}>
            <main className={"space-y-4"}>
                <div className={"flex justify-between items-center bg-blue-400"}>
                    <PageHeader title={messages.appmenu.games}/>
                    <div className="md:px-3 text-lg text-gray-600 flex">
                        <NavLink to={"deleteExpired"}>
                            <button
                                className="ml-auto p-3 text-slate-800 rounded-l-lg hover:text-blue-600 text-sm bg-white hover:bg-slate-100 border border-slate-200 font-small md:font-medium px-4 py-2 inline-flex space-x-1 items-center">
                                <i className={"fa fa-trash"}/>
                                <span className={"hidden lg:inline px-1"}>{messages.adminGamesForm.deleteExpired}</span>
                            </button>
                        </NavLink>

                        <NavLink to={"new"}>
                            <button
                                className="ml-auto p-3 text-slate-800 hover:text-blue-600 rounded-r-lg text-sm bg-white hover:bg-slate-100 border border-slate-200 font-small md:font-medium px-4 py-2 inline-flex space-x-1 items-center">
                                <i className={"fa fa-plus"}/>
                                <span className={"hidden lg:inline px-1"}>{messages.adminGamesForm.new}</span>
                            </button>
                        </NavLink>
                    </div>
                </div>
                <GamesList games={games ?? []} actions={actions ?? []}/>
            </main>
        </ContentContainer>
    );
};

export default Games;
