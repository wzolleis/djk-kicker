import {NavLink} from "@remix-run/react";
import messages from "~/components/i18n/messages";
import PageHeader from "~/components/common/PageHeader";
import ContentContainer from "~/components/common/container/ContentContainer";
import {Game, GameAction} from "@prisma/client";
import {useDateTime} from "~/utils";
import classNames from "classnames";
import {useAdminGameData} from "~/utils/gameUtils";
import {useState} from "react";
import GameActionList from "~/components/game/admin/adminGameActionList";
import {DeleteGameButton} from "~/components/game/admin/functionButtons/deleteGame";
import {SendMailButton} from "~/components/game/admin/functionButtons/SendMail";
import {EditGameButton} from "~/components/game/admin/functionButtons/editGame";
import ExpandableContainer from "~/components/common/container/ExpandableContainer";

type GamesListProps = {
    games: Game[];
    actions: GameAction[]
}

const GameView = ({game, actions}: { game: Game, actions: GameAction[] }) => {
    const [actionsHidden, setHideActions] = useState<boolean>(true)
    const gameActions = actions.filter(action => action.gameId === game.id)

    const toggleShowActions = () => {
        setHideActions(!actionsHidden)
    }

    const gameStatusClass = {
        "text-green-500": game.status === 'Zusage',
        "text-red-500": game.status === "Absage"
    }

    return (
        <>
            <div className="flex items-center justify-between border-b">
                <div
                    className="p-3 text-gray-700 text-lg font-bold">{`${game.name || 'Spiel'} am ${useDateTime(game.gameTime)}`}</div>
                <div className="p-3 flex">
                </div>
            </div>
            <div className={"p-3 text-lg"}>
                <span className={classNames(gameStatusClass, "mr-3")}>{game.status ?? "Noch kein Status"}</span>
                <button type='button' onClick={toggleShowActions}>
                    <i className={classNames({"fa-circle-right": !actionsHidden, "fa-circle-down": actionsHidden}, "fa-solid")}/>
                </button>
                <ExpandableContainer hidden={actionsHidden}>
                    <GameActionList actions={gameActions}/>
                </ExpandableContainer>
            </div>
            <div className="p-3 border-t text-lg flex">
                <EditGameButton gameId={game.id}/>
                <DeleteGameButton gameId={game.id}/>
                <SendMailButton gameId={game.id}/>
            </div>
        </>
    )
}

const GamesList = ({games, actions}: GamesListProps) => {
    return (
        <div className={"w-full space-y-3"}>
            {
                games.map((game) => {
                    return (
                        <div className="bg-blue-200 h-50 rounded-lg" key={game.id}>
                            <GameView game={game} actions={actions}/>
                        </div>
                    )
                })
            }
        </div>
    )
}

const Games = () => {
    const {games, actions} = useAdminGameData()

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
