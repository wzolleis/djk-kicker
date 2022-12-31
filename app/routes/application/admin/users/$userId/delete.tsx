import {Form, useLoaderData} from "@remix-run/react";
import {ExclamationTriangleIcon} from "@heroicons/react/24/solid";
import messages from "~/components/i18n/messages";
import ButtonContainer from "~/components/common/container/ButtonContainer";
import DefaultButton from "~/components/common/buttons/DefaultButton";
import RedButton from "~/components/common/buttons/RedButton";
import {ActionFunction, json, LoaderFunction, redirect} from "@remix-run/node";
import invariant from "tiny-invariant";
import {Params} from "react-router";
import routeLinks from "~/helpers/constants/routeLinks";
import {User} from "@prisma/client";
import {deleteUserById, getUserById} from "~/models/user.server";
import {requireUserId} from "~/session.server";

export const loader: LoaderFunction = async ({params, request}) => {
    await requireUserId(request)
    const userId = params.userId;
    invariant(!!userId, "Keine Spieler ID in der URL")
    const user = await getUserById(userId)
    invariant(!!user, "User nicht gefunden")
    return json({user})
}

export const action: ActionFunction = async ({params, request}: { params: Params, request: Request }) => {
    await requireUserId(request)
    const userId = params.userId;
    const formData = await request.formData();
    const intent = formData.get('intent')
    invariant(!!userId, "Keine Spieler ID in der URL")
    invariant(!!intent, "Kein Intent gesetzt")

    if (intent === 'abort') {
        return redirect(routeLinks.admin.users.home)
    } else if (intent === 'delete') {
        const user = await getUserById(userId)
        invariant(!!user, "User nicht gefunden")
        await deleteUserById(user.id)
    }
    return redirect(routeLinks.admin.users.home)
}

type LoaderData = {
    user: User,
}

const UserDeleteView = () => {
    // @ts-ignore
    const {user} = useLoaderData() as LoaderData;

    return (
        <Form method={'post'}>
            <div className="flex flex-col bg-red-100 rounded-lg p-4 mb-4 text-sm text-red-700" role="alert">
                <div>
                    <ExclamationTriangleIcon className="w-10 h-10 inline mr-3" fill="currentColor"/>
                    <span
                        className="text-lg">{messages.adminUserDeleteForm.confirmationQuestion(user?.name ?? user.email)}</span>
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

export default UserDeleteView