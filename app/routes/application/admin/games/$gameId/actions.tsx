import {Link, useLoaderData} from "@remix-run/react";
import {findGameById} from "~/models/admin.games.server";
import {findActionsByGameId} from "~/models/gameActions.server";
import {json, LoaderFunction} from "@remix-run/node";
import invariant from "tiny-invariant";
import {GameAction} from "@prisma/client";
import dateUtils from "~/dateUtils";
import messages from "~/components/i18n/messages";

type LoaderData = {
    game: Awaited<ReturnType<typeof findGameById>>;
    actions: Awaited<ReturnType<typeof findActionsByGameId>>;
};

export const loader: LoaderFunction = async ({params: {gameId}}) => {
    invariant(gameId, "Expected params.gameId");
    return json<LoaderData>({
        game: await findGameById(gameId),
        actions: await findActionsByGameId({gameId})
    });
};

const ActionView = ({action}: { action: GameAction }) => {
    let background = ''
    switch (action.actionType) {
        case 'GAME_INVITATION':
            background = 'bg-gray-500'
            break
        case 'GAME_ZUSAGE':
            background = 'bg-green-500'
            break
        case 'GAME_ABSAGE':
            background = 'bg-red-500'
            break
        default:
            background = ''
            break
    }

    return (
        <div className={`flex items-center h-24 px-4 space-x-4 w-full ${background}`}>
            <div className="flex-shrink-0">
                <i className="fa-solid fa-comments text-white"></i>
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                    {action.actionType}
                </p>
                <p className="text-sm text-white truncate">
                    {dateUtils.format(new Date(action.updatedAt))}
                </p>
            </div>
            <div className="flex items-center justify-between mb-4"/>
            <div
                className="inline-flex items-center text-base font-semibold text-white">
                <Link className={"flex justify-start items-center"} to="actions">
                    <div className={"p-3 shadow-lg shadow-indigo-500/40 rounded-full pr-2"}>
                        <img src="/img/arrow-indigo.png" className={"h-4 w-4"} alt=""/>
                    </div>
                    <span className={"pl-2"}>Details</span>
                </Link>
            </div>
        </div>
    )
}

const ActionList = ({actions}: { actions: GameAction[] }) => {
    if (actions.length === 0) {
        return (
            <div className="mx-5">
                <div className="py-2 grid justify-start items-center md:grid-cols-2">
                    <div className="p-4 bg-gray-300 border rounded-lg shadow-md sm:p-8 md:col-span-2">
                        <div className="flex justify-start items-center">
                            <div className="p-3 shadow-lg shadow-indigo-500/40 rounded-full pr-2">
                                <img src="/img/arrow-indigo.png" className={"h-4 w-4"} alt=""/>
                            </div>
                            <span className="pl-4">{messages.adminGameActionsForm.noActions}</span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="mx-5">
            <div className="pb-3 font-poppins-semibold">
                {messages.adminGameActionsForm.title}
            </div>
            <div className="p-4 bg-white border rounded-lg shadow-md sm:p-8 bg-gray-300">
                <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
                    {
                        actions.map((action) => {
                                return (
                                    <li className="py-3 sm:py-4 w-full" key={action.id}>
                                        <ActionView action={action}/>
                                    </li>
                                )
                            }
                        )}
                </ul>
            </div>
        </div>
    )
}

const Actions = () => {
    const {actions} = useLoaderData<LoaderData>();
    return (
        <>
            {/* @ts-ignore */}
            <ActionList actions={actions}/>
        </>
    )
}


export default Actions