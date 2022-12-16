import {json, LoaderFunction} from "@remix-run/node";
import invariant from "tiny-invariant";
import {AdminInvitation} from "@prisma/client";
import {useLoaderData} from "@remix-run/react";
import ErrorView from "~/components/errorhandling/ErrorView";
import InviteUserResponseForm from "~/components/users/admin/InviteUserResponseForm";
import {DateTime} from "luxon";
import {getAdminInvitation} from "~/models/admin.user.invitation.server";
import {decryptEncryptedAdminToken} from "~/utils/token.server";

type LoaderData = {
    adminInvitation: AdminInvitation,
}

export const loader: LoaderFunction = async ({params, request}) => {
    const inviteId = params.inviteId;
    invariant(!!inviteId, "Help");

    const adminInvitation = await getAdminInvitation(inviteId)
    invariant(!!adminInvitation, "Keine Einladung gefunden")

    const url = new URL(request.url);
    const token = url.searchParams.get("token")
    invariant(!!token, "Kein Token")

    const tokenObject = await decryptEncryptedAdminToken(token)
    invariant(adminInvitation.email === tokenObject.payload['email'])

    const validUntil = DateTime.fromISO(tokenObject.payload["expires_at"] as string)
    invariant(validUntil.endOf('day') > DateTime.now(), "Das Token ist abgelaufen")

    return json({adminInvitation: adminInvitation});
};


const InviteView = () => {
    // @ts-ignore
    const {adminInvitation} = useLoaderData() as LoaderData;
    const validUntil = DateTime.fromJSDate(new Date(adminInvitation.expires_at))
    return (
        <>
            <InviteUserResponseForm validUntil={validUntil} name={adminInvitation.name} email={adminInvitation.email}/>
        </>
    )
}

export const ErrorBoundary = ({error}: { error: Error }) => {
    return (
        <ErrorView error={error}/>
    )
}

export default InviteView