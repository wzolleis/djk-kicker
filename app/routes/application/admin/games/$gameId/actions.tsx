import {useLoaderData} from "@remix-run/react";
import {findGameById} from "~/models/admin.games.server";
import {findActionsByGameId} from "~/models/gameActions.server";
import {json, LoaderFunction} from "@remix-run/node";
import invariant from "tiny-invariant";
import {Game, GameAction} from "@prisma/client";
import messages from "~/components/i18n/messages";
import ContentContainer from "~/components/common/container/ContentContainer";
import SmallTag from "~/components/common/tags/SmallTag";
import {useDate} from "~/utils";
import ActionCard from "~/components/actions/ActionCard";
import {configuration} from "~/config";

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

const ActionList = ({actions, game}: { actions: GameAction[], game: Game }) => {
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
        <>
            <ContentContainer>
                <div className={"flex flex-col justify-center items-start"}>
                    <p className={"font-default-bold text-title-large"}>{game.name}</p>
                    <div className={"flex gap-2"}>
                        {/* eslint-disable-next-line react-hooks/rules-of-hooks */}
                        <SmallTag text={useDate(new Date(game.gameTime.toString()))}></SmallTag>
                        <SmallTag
                            text={configuration.gameLocations[game.spielort as unknown as number]}></SmallTag>
                    </div>
                </div>
            </ContentContainer>
            <ContentContainer>
                <h1 className={"font-default-bold text-title-large"}>{messages.adminGameActionsForm.title}</h1>
                <div className={"flex flex-col gap-4"} >
                        {
                            actions.map((action) => {
                                    return (
                                            <ActionCard key={action.id} action={action}/>
                                    )
                                }
                            )}
                </div>
            </ContentContainer>
        </>
    )
}

const Actions = () => {
    const {actions, game} = useLoaderData<LoaderData>();
    return (
        <>
            {/* @ts-ignore */}
            <ActionList game={game} actions={actions}/>
        </>
    )
}


export default Actions