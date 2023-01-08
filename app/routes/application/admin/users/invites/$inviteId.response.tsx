import {ActionFunction, json, LoaderFunction, redirect} from "@remix-run/node";
import {AdminInvitation} from "@prisma/client";
import {Form, useCatch, useLoaderData, useNavigate, useParams} from "@remix-run/react";
import {DateTime} from "luxon";
import {getAdminInvitation, updateAdminInvitation} from "~/models/admin.user.invitation.server";
import routeLinks from "~/config/routeLinks";
import {Params} from "react-router";
import DefaultButton from "~/components/common/buttons/DefaultButton";
import messages from "~/components/i18n/messages";
import React from "react";
import PageHeader from "~/components/common/PageHeader";
import InputWithLabel from "~/components/common/form/InputWithLabel";
import dateUtils from "~/dateUtils";
import ButtonContainer from "~/components/common/container/ButtonContainer";
import RedButton from "~/components/common/buttons/RedButton";
import SuccessButton from "~/components/common/buttons/SuccessButton";
import SubmitButton from "~/components/common/buttons/submitButton";

type LoaderData = {
    adminInvitation: AdminInvitation,
}

export const action: ActionFunction = async ({params, request}: { params: Params, request: Request }) => {
    const url = new URL(request.url);
    const token = url.searchParams.get("token")
    if (!token) {
        throw new Response("Es ist kein Token gesetzt", {status: 400, statusText: "Es ist kein Token gesetzt"})
    }

    const formData = await request.formData();
    const inviteId = params.inviteId;
    if (!inviteId) {
        throw new Response("Ungültige Einladung", {status: 400, statusText: "Keine Einladung in der URL"})
    }
    const invitation = await getAdminInvitation(inviteId)
    if (!invitation) {
        throw new Response("Einladung nicht gefunden", {
            status: 400,
            statusText: `Einladung mit der ID "${inviteId}" nicht gefunden`
        })
    }

    const intent = formData.get('intent')
    if (intent === 'reject') {
        await updateAdminInvitation(inviteId, {invitationStatus: 'rejected', name: invitation.name})
        return redirect(routeLinks.dashboard)
    }
    return redirect(routeLinks.admin.users.invite.accept({inviteId, token}))
}

export const loader: LoaderFunction = async ({params}) => {
    const inviteId = params.inviteId;
    if (!inviteId) {
        throw new Response("Ungültiger Link", {status: 400, statusText: "Ungültiger Link"})
    }

    const adminInvitation = await getAdminInvitation(inviteId)
    if (!adminInvitation) {
        throw new Response("Einladung nicht gefunden", {status: 404, statusText: "Die Einladung wurde nicht gefunden."})
    }
    return json({adminInvitation: adminInvitation});
};

const InviteChoiceView = () => {
    // @ts-ignore
    const {adminInvitation} = useLoaderData() as LoaderData;
    const validUntil = DateTime.fromJSDate(new Date(adminInvitation.expires_at))
    return (
        <>
            <header>
                <PageHeader title={messages.adminInviteUserChoiceForm.title}/>
            </header>
            <Form method={"post"} className="md:w-1/2">
                <main className={"flex flex-col gap-4"}>
                    <InputWithLabel label={messages.adminInviteUserChoiceForm.email}
                                    type='email'
                                    name={'email'}
                                    id={'email'}
                                    disabled={true}
                                    defaultValue={adminInvitation.email || ''}
                    />
                    <InputWithLabel label={messages.adminInviteUserChoiceForm.validUntil}
                                    type='text'
                                    name={'validUntil'}
                                    id={'validUntil'}
                                    disabled={true}
                                    defaultValue={dateUtils.dateToFormat({value: validUntil})}
                    />
                    <InputWithLabel label={messages.adminInviteUserChoiceForm.name}
                                    type='text'
                                    name={'adminName'}
                                    id={'adminName'}
                                    defaultValue={adminInvitation.name}
                    />
                    <ButtonContainer>
                        <RedButton>
                            <SubmitButton label={messages.adminInviteUserChoiceForm.rejectInvitation}
                                          loadingLabel={messages.adminInviteUserChoiceForm.rejectInvitation}
                                          name={"intent"}
                                          value={"reject"}
                            />
                        </RedButton>
                        <SuccessButton className='ml-auto'>
                            <SubmitButton label={messages.adminInviteUserChoiceForm.acceptInvitation}
                                          loadingLabel={messages.adminInviteUserChoiceForm.acceptInvitation}
                                          name={"intent"}
                                          value={"accept"}
                            />
                        </SuccessButton>
                    </ButtonContainer>
                </main>
            </Form>
        </>
    )
}

export const CatchBoundary = () => {
    const caught = useCatch();
    const navigate = useNavigate()
    const params = useParams<{ invitedId: string }>();
    if (caught.status === 404) {
        return (
            <div className="error-container">
                Die Einladung "{params.invitedId}" wurde nicht gefunden.
            </div>
        );
    }
    if (caught.status === 400) {
        return (
            <div className="error-container">
                <h4 className={"font-default-bold text-display-small tracking-tighter text-black"}>
                    {`Die Einladung kann nicht bearbeitet werden: ${caught.statusText}`}
                </h4>
                <DefaultButton className={"flex justify-center"}>
                    <button onClick={() => navigate(routeLinks.games)}>{messages.appmenu.dashboard}</button>
                </DefaultButton>
            </div>
        );
    }
    throw new Error(`Unhandled error: ${caught.status}`);
}

export default InviteChoiceView