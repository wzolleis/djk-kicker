import messages from "~/components/i18n/messages";
import {ActionFunction, json, LoaderFunction, redirect} from "@remix-run/node";
import invariant from "tiny-invariant";
import {AdminInvitation} from "@prisma/client";
import {Form, useLoaderData} from "@remix-run/react";
import {ExclamationTriangleIcon} from "@heroicons/react/24/solid";
import ButtonContainer from "~/components/common/container/ButtonContainer";
import RedButton from "~/components/common/buttons/RedButton";
import DefaultButton from "~/components/common/buttons/DefaultButton";
import {Params} from "react-router";
import routeLinks from "~/helpers/constants/routeLinks";
import {deleteAdminInvitation, getAdminInvitation} from "~/models/admin.user.invitation.server";

export const loader: LoaderFunction = async ({params}) => {
    const inviteId = params.inviteId;
    invariant(!!inviteId, "Keine Spieler ID in der URL")
    const invitation = await getAdminInvitation(inviteId)
    invariant(!!invitation, "Einladung nicht gefunden")
    return json({invitation})
}

export const action: ActionFunction = async ({params, request}: { params: Params, request: Request }) => {
    const inviteId = params.inviteId
    const formData = await request.formData();
    const intent = formData.get('intent')
    invariant(!!inviteId, "Keine Einladung")
    invariant(!!intent, "Kein Intent gesetzt")

    if (intent === 'abort') {
        return redirect(routeLinks.admin.users.home)
    } else if (intent === 'delete') {
        const invitation = await getAdminInvitation(inviteId)
        invariant(!!invitation, "Einladung nicht gefunden")
        await deleteAdminInvitation(inviteId)
    }
    return redirect(routeLinks.admin.users.home)
}

type LoaderData = {
    invitation: AdminInvitation,
}

const DeleteAdminInvitation = () => {
    // @ts-ignore
    const {invitation} = useLoaderData() as LoaderData;
    return (
        <Form method={'post'}>
            <div className="flex flex-col bg-red-100 rounded-lg p-4 mb-4 text-sm text-red-700" role="alert">
                <div>
                    <ExclamationTriangleIcon className="w-10 h-10 inline mr-3" fill="currentColor"/>
                    <span className="text-lg">{messages.adminInvitationDeleteForm.confirmationQuestion(invitation.name)}</span>
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

export default DeleteAdminInvitation