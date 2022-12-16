import {json, LoaderFunction} from "@remix-run/node";
import invariant from "tiny-invariant";
import {AdminInvitation} from "@prisma/client";
import {prisma} from "~/db.server";
import {useLoaderData} from "@remix-run/react";

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

    console.log('>>>>> invitation = ', JSON.stringify(adminInvitation, undefined, 3))

    return (
        <div>Invite view</div>
    )
}

export default InviteView