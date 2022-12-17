import {ActionFunction, json, LoaderFunction, redirect} from "@remix-run/node";
import {AdminInvitation} from "@prisma/client";
import {useCatch, useLoaderData, useParams} from "@remix-run/react";
import {DateTime} from "luxon";
import {getAdminInvitation} from "~/models/admin.user.invitation.server";
import {decryptEncryptedAdminToken} from "~/utils/token.server";
import InviteChoiceForm from "~/components/users/admin/InviteChoiceForm";
import routeLinks from "~/helpers/constants/routeLinks";
import {Params} from "react-router";

type LoaderData = {
    adminInvitation: AdminInvitation,
}

type AdminToken = {
    email: string
    expires_at: string
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
    const intent = formData.get('intent')
    if (intent === 'reject') {
        return redirect(routeLinks.games)
    }
    return redirect(routeLinks.admin.users.invite.accept({inviteId, token}))
}

export const loader: LoaderFunction = async ({params, request}) => {
    const inviteId = params.inviteId;
    if (!inviteId) {
        throw new Response("Ungültiger Link", {status: 400, statusText: "Ungültiger Link"})
    }

    const adminInvitation = await getAdminInvitation(inviteId)
    if (!adminInvitation) {
        throw new Response("Einladung nicht gefunden", {status: 404, statusText: "Die Einladung ist ungültig"})
    }

    const url = new URL(request.url);
    const token = url.searchParams.get("token")
    if (!token) {
        throw new Response("Es ist kein Token gesetzt", {status: 400, statusText: "Es ist kein Token gesetzt"})
    }

    const adminToken = (await decryptEncryptedAdminToken(token)).payload as AdminToken
    if (adminToken.email !== adminInvitation.email) {
        throw new Response("Das Token ist ungültig", {status: 400, statusText: "Das Token ist ungültig"})
    }
    const validUntil = DateTime.fromISO(adminToken.expires_at)
    if (validUntil.endOf('day') < DateTime.now()) {
        throw new Response("Das Token ist abgelaufen", {status: 400, statusText: "Das Token ist abgelaufen"})
    }

    return json({adminInvitation: adminInvitation});
};

const InviteChoiceView = () => {
    // @ts-ignore
    const {adminInvitation} = useLoaderData() as LoaderData;
    const validUntil = DateTime.fromJSDate(new Date(adminInvitation.expires_at))
    return (
        <InviteChoiceForm validUntil={validUntil} name={adminInvitation.name} email={adminInvitation.email}/>
    )
}

export const CatchBoundary = () => {
    const caught = useCatch();
    const params = useParams<{invitedId: string}>();
    if (caught.status === 404) {
        return (
            <div className="error-container">
                Huh? What the heck is "{params.invitedId}"?
            </div>
        );
    }
    if (caught.status === 400) {
        return (
            <div className="error-container">
                {`Huh? What the heck are u doing: ${caught.statusText}`}
            </div>
        );
    }
    throw new Error(`Unhandled error: ${caught.status}`);
}

export const ErrorBoundary = () => {
    const { invitedId } = useParams<{invitedId: string}>();
    return (
        <div className="error-container">{`There was an error loading the invitation by the id ${invitedId}. Sorry.`}</div>
    );
}

export default InviteChoiceView