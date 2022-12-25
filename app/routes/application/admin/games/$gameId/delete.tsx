import messages from "~/components/i18n/messages";
import {ActionFunction, json, LoaderFunction, redirect} from "@remix-run/node";
import invariant from "tiny-invariant";
import {Game} from "@prisma/client";
import {Form, useLoaderData} from "@remix-run/react";
import {ExclamationTriangleIcon} from "@heroicons/react/24/solid";
import ButtonContainer from "~/components/common/container/ButtonContainer";
import RedButton from "~/components/common/buttons/RedButton";
import DefaultButton from "~/components/common/buttons/DefaultButton";
import {Params} from "react-router";
import routeLinks from "~/helpers/constants/routeLinks";
import {deleteGame, findGameById} from "~/models/admin.games.server";
import {useDateTime} from "~/utils";
import {getGameById} from "~/models/games.server";

type LoaderData = {
    game: Game
}

export const loader: LoaderFunction = async ({params}) => {
    const gameId = params.gameId
    if (!gameId) {
        return redirect("/application/admin/games")
    }
    const game = await findGameById(gameId);
    return json<LoaderData>({game})
}

export const action: ActionFunction = async ({params, request}: { params: Params, request: Request }) => {
    const gameId = params.gameId
    const formData = await request.formData();
    const intent = formData.get('intent')
    invariant(!!gameId, "Kein Spiel")
    invariant(!!intent, "Kein Intent gesetzt")

    console.log('intent', intent)

    if (intent === 'abort') {
        return redirect(routeLinks.admin.users.home)
    } else if (intent === 'delete') {
        const game = await getGameById(gameId)
        invariant(!!game, "Spiel nicht gefunden")
        await deleteGame(gameId)
    }
    return redirect(routeLinks.admin.games)
}

const DeleteGame = () => {
    // @ts-ignore
    const {game} = useLoaderData() as unknown as LoaderData
    return (
        <Form method={'post'}>
            <div className="flex flex-col bg-red-100 rounded-lg p-4 mb-4 text-sm text-red-700" role="alert">
                <div>
                    <ExclamationTriangleIcon className="w-10 h-10 inline mr-3" fill="currentColor"/>
                    <span className="text-lg">{messages.deleteGameForm.confirmationQuestion(useDateTime(new Date(game.gameTime)))}</span>
                </div>
                <ButtonContainer className={'pt-5'}>
                    <DefaultButton className={'mr-5'}>
                        <button name={'intent'} value={'abort'} type={'submit'}>{messages.buttons.cancel}</button>
                    </DefaultButton>
                    <RedButton>
                        <button type={'submit'} name={'intent'} value={'delete'}>{messages.buttons.delete}</button>
                    </RedButton>
                </ButtonContainer>
            </div>
        </Form>
    )
}

export default DeleteGame