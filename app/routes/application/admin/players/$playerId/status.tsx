import {ActionFunction, json, LoaderFunction, redirect} from "@remix-run/node";
import invariant from "tiny-invariant";
import {getPlayerById, updatePlayer} from "~/models/player.server";
import {Player} from "@prisma/client";
import {requireUserId} from "~/session.server";
import {Form, useLoaderData, useNavigate} from "@remix-run/react";
import messages from "~/components/i18n/messages";
import ButtonContainer from "~/components/common/container/ButtonContainer";
import Button from "~/components/common/buttons/Button";
import {ExclamationTriangleIcon} from "@heroicons/react/24/solid";
import {Params} from "react-router";
import routeLinks from "~/config/routeLinks";
import classNames from "classnames";

type LoaderData = {
    player: Player
}

export const loader: LoaderFunction = async ({params, request}) => {
    await requireUserId(request);
    invariant(params.playerId, "expected playerId in url parameters");
    const playerId = params.playerId;
    const player = await getPlayerById(playerId)
    invariant(!!player, `Spieler mit der ID ${playerId} nicht gefunden`)
    return json<LoaderData>({player});
};

export const action: ActionFunction = async ({params}: { params: Params, request: Request }) => {
    invariant(params.playerId, "expected playerId in url parameters");
    const playerId = params.playerId;
    const player = await getPlayerById(playerId)
    invariant(!!player, `Spieler mit der ID ${playerId} nicht gefunden`)
    await updatePlayer(playerId, {
        isActive: !player.isActive,
    })
    return redirect(routeLinks.admin.users.home)
}

const EditPlayerStatus = () => {
    const {player} = useLoaderData<LoaderData>() as unknown as LoaderData
    const {isActive, name} = player
    const navigate  = useNavigate()

    const activePlayer = {
        question: messages.playerStatusForm.deactivateConfirmationQuestion(name),
        buttonLabel: messages.buttons.deactivate
    }
    const inactivePlayer = {
        question: messages.playerStatusForm.activateConfirmationQuestion(name),
        buttonLabel: messages.buttons.activate
    }

    const params = isActive ? activePlayer : inactivePlayer

    const background = {
        'bg-gray-400': isActive,
        'bg-green-100': !isActive,
        'text-white': isActive,
        'text-black': !isActive
    }

    const buttonColor = {
        'bg-gray-500': isActive,
        'bg-green-500': !isActive
    }

    return (
        <Form method={'post'}>
            <div className={classNames(background, "flex flex-col rounded-lg p-4 mb-4 text-sm w-full xl:w-1/4 mx-auto")}>
                <div>
                    <ExclamationTriangleIcon className="w-10 h-10 inline mr-3" fill="currentColor"/>
                    <span className="text-lg">{params.question}</span>
                </div>
                <ButtonContainer className={'pt-5'}>
                    <Button className={'bg-blue-500'}>
                        <button type={"button"} onClick={() => navigate(-1)}>{messages.buttons.cancel}</button>
                    </Button>
                    <Button className={classNames(buttonColor, 'ml-auto')}>
                        <button type={'submit'}>{params.buttonLabel}</button>
                    </Button>
                </ButtonContainer>
            </div>
        </Form>
    )
}

export default EditPlayerStatus