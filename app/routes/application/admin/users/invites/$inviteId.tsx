import {json, LoaderFunction} from "@remix-run/node";
import invariant from "tiny-invariant";
import {AdminInvitation} from "@prisma/client";
import {prisma} from "~/db.server";
import {useLoaderData} from "@remix-run/react";
import ErrorView from "~/components/errorhandling/ErrorView";
import InviteUserResponseForm from "~/components/users/admin/InviteUserResponseForm";
import {DateTime} from "luxon";

type LoaderData = {
    adminInvitation: AdminInvitation,
}

export const loader: LoaderFunction = async ({params, request}) => {
    const inviteId = params.inviteId;
    invariant(inviteId, "Help");
    const adminInvitation = await prisma.adminInvitation.findUnique({
        where: {
            id: inviteId
        }
    })
    invariant(!!adminInvitation, "Keine Einladung gefunden")
    return json({adminInvitation: adminInvitation});
};


const InviteView = () => {
    // @ts-ignore
    const {adminInvitation} = useLoaderData() as LoaderData;
    const validUntil = DateTime.fromJSDate(new Date(adminInvitation.expires_at))

    console.log('>>>>> invitation = ', JSON.stringify(adminInvitation, undefined, 3))

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