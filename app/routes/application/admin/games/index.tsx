import {Form, NavLink} from "@remix-run/react";
import messages from "~/components/i18n/messages";
import ContentContainer from "~/components/common/container/ContentContainer";
import {Game} from "@prisma/client";
import {useDateTime} from "~/utils";
import classNames from "classnames";
import {useAdminGameData} from "~/utils/gameUtils";
import {DeleteGameButton} from "~/components/game/admin/functionButtons/deleteGame";
import {SendMailButton} from "~/components/game/admin/functionButtons/SendMailButton";
import {EditGameButton} from "~/components/game/admin/functionButtons/editGame";
import {GameActionHistoryButton} from "~/components/game/admin/functionButtons/GameActionHistoryButton";
import TransitionContainer from "~/components/common/container/transitionContainer";
import {GameFeedbackButton} from "~/components/game/admin/functionButtons/GameFeedbackButton";
import {ActionFunction, redirect} from "@remix-run/node";
import {Params} from "react-router";
import invariant from "tiny-invariant";
import routeLinks from "~/config/routeLinks";
import {FormWrapper} from "~/utils/formWrapper.server";
import ButtonContainer from "~/components/common/container/ButtonContainer";
import {isGameActionButtonIntent} from "~/components/game/admin/functionButtons/gameButtonTypes";
import DefaultButton from "~/components/common/buttons/DefaultButton";

type GamesListProps = {
    games: Game[];
}

type AdminGameForm = 'intent' | 'gameId'

export const action: ActionFunction = async ({params, request}: { params: Params, request: Request }) => {
    const formData = await request.formData();
    const wrapper = new FormWrapper<AdminGameForm>(formData)
    const intent = wrapper.get('intent')
    const gameId = wrapper.get('gameId')
    invariant(!!intent, "Kein Intent")
    invariant(!!gameId, "Kein Spiel")
    invariant(typeof gameId === 'string', "GameId ist kein String")
    invariant(isGameActionButtonIntent(intent), `Ungültiger Intent: ${intent}`)

    if (isGameActionButtonIntent(intent)) {
        if (intent === 'feedback') {
            return redirect(routeLinks.admin.game.feedback(gameId))
        } else if (intent === 'edit') {
            return redirect(routeLinks.admin.game.edit(gameId))
        } else if (intent === 'delete') {
            return redirect(routeLinks.admin.game.delete(gameId))
        } else if (intent === 'history') {
            return redirect(routeLinks.admin.game.history(gameId))
        } else if (intent === 'sendMail') {
            return redirect(routeLinks.admin.game.sendMail(gameId))
        }
    }
    return redirect(routeLinks.admin.game.details(gameId))
}

const GameView = ({game}: { game: Game }) => {
    const gameStatusClass = {
        "text-green-500": game.status === 'Zusage',
        "text-red-500": game.status === "Absage"
    }

    return (
        <>
            <div className="flex items-center justify-between border-b">
                <div
                    className="p-3 text-gray-700 text-lg font-bold">{`${game.name || 'Spiel'} am ${useDateTime(game.gameTime)}`}</div>
            </div>
            <div className={"p-3 text-lg"}>
                <span className={classNames(gameStatusClass, "mr-3")}>{game.status ?? "Noch kein Status"}</span>
            </div>
            <div className="p-3 border-t text-lg flex">
                <Form method={'post'}>
                    <input type={'hidden'} name={'gameId'} value={game.id}/>
                    <ButtonContainer className={'pt-5'}>
                        <EditGameButton gameId={game.id} intent={'edit'}/>
                        <GameFeedbackButton gameId={game.id} intent={'feedback'}/>
                        <GameActionHistoryButton gameId={game.id} intent={'history'}/>
                        <SendMailButton gameId={game.id} intent={'sendMail'}/>
                        <DeleteGameButton gameId={game.id} intent={'delete'}/>
                    </ButtonContainer>
                </Form>
            </div>
        </>
    )
}

const GamesList = ({games}: GamesListProps) => {
    return (
        <div className={"w-full space-y-3"}>
            {
                games.map((game) => {
                    return (
                        <div className="bg-blue-200 h-50 rounded-lg" key={game.id}>
                            <GameView game={game}/>
                        </div>
                    )
                })
            }
        </div>
    )
}

const Games = () => {
    const {games} = useAdminGameData()

    return (
        <TransitionContainer>
            <ContentContainer className={"mt-5"}>
                <main className={"space-y-4"}>
                    <div className={"flex justify-between items-center"}>
                        <div className="md:px-3 text-lg text-gray-600 flex ml-auto">
                            <NavLink to={"new"}>
                                <DefaultButton>
                                    <i className={"fa fa-plus"}/>
                                    <span className={"inline px-1"}>{messages.adminGamesForm.new}</span>
                                </DefaultButton>
                            </NavLink>
                        </div>
                    </div>
                    <GamesList games={games ?? []}/>
                </main>
            </ContentContainer>
        </TransitionContainer>
    );
};

export default Games;
