import {ActionFunction, json, LoaderFunction, redirect} from "@remix-run/node";
import {AdminInvitation} from "@prisma/client";
import {useActionData, useCatch, useLoaderData} from "@remix-run/react";
import {DateTime} from "luxon";
import {getAdminInvitation, updateAdminInvitation} from "~/models/admin.user.invitation.server";
import {decryptEncryptedAdminToken} from "~/utils/token.server";
import routeLinks from "~/helpers/constants/routeLinks";
import {Params} from "react-router";
import InviteUserResponseForm, {InviteUserResponseErrors} from "~/components/users/admin/InviteUserResponseForm";
import invariant from "tiny-invariant";
import {createUser, getUserByEmail} from "~/models/user.server";

type LoaderData = {
    adminInvitation: AdminInvitation,
}

type AdminToken = {
    email: string
    expires_at: string
}

export const action: ActionFunction = async ({params, request}: { params: Params, request: Request }) => {
    const formData = await request.formData();
    const adminName = formData.get('adminName')
    const email = formData.get('email')
    const password = formData.get('password')
    const passwordRepeat = formData.get('passwordRepeat')
    const inviteId = params.inviteId;

    invariant(typeof inviteId === 'string', "Keine Einladung in der URL enthalten")
    invariant(typeof email === 'string', "EMail fehlt")
    invariant(typeof password === 'string', "Passwort fehlt")
    invariant(typeof passwordRepeat === 'string', "Passwortwiederholung fehlt")
    invariant(typeof adminName === 'string', "Name fehlt")

    const invitation = await getAdminInvitation(inviteId)
    invariant(!!invitation, `Einladung mit der ID "${inviteId}" nicht gefunden`)
    const userByMail = await getUserByEmail(email!)
    invariant(!userByMail, "Es existiert bereits ein Anwender für diese Mail-Adresse")

    const errors: InviteUserResponseErrors = {
        adminName: adminName ? null : "Name eingeben",
        password: password ? null : "Passwort eingeben",
        passwordRepeat: (password === passwordRepeat) ? null : "Passwortwiederholung",
    };
    const hasErrors = Object.values(errors).some(
        (errorMessage) => errorMessage
    );
    if (hasErrors) {
        return json(errors);
    }

    await createUser(email, password, adminName)
    await updateAdminInvitation(inviteId, {invitationStatus: 'accepted', name: invitation.name})

    return redirect(routeLinks.admin.users.home)
}

export const loader: LoaderFunction = async ({params, request}) => {
    const inviteId = params.inviteId;
    if (!inviteId || inviteId === "undefined") {
        throw new Response("Keine Einladungsid im Link", {
            status: 400,
            statusText: `Die Einladung "${inviteId}" im Link ist ungültig`
        })
    }

    const adminInvitation = await getAdminInvitation(inviteId)
    if (!adminInvitation) {
        throw new Response("Einladung nicht gefunden", {
            status: 404,
            statusText: `Die Einladung "${inviteId}" ist ungültig`
        })
    }

    const url = new URL(request.url);
    const token = url.searchParams.get("token")
    if (!token) {
        throw new Response("Ungültiges Token", {status: 400, statusText: `Ungültiges Token: "${token}"`})
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

const InviteResponseView = () => {
    const errors = useActionData<typeof action>();
    // @ts-ignore
    const {adminInvitation} = useLoaderData() as LoaderData;
    const validUntil = DateTime.fromJSDate(new Date(adminInvitation.expires_at))
    return (
        <>
            <InviteUserResponseForm validUntil={validUntil}
                                    name={adminInvitation.name}
                                    email={adminInvitation.email}
                                    errors={errors}/>
        </>
    )
}

export const CatchBoundary = () => {
    const caught = useCatch();
    if (caught.status === 400 || caught.status === 404) {
        return (
            <div className="error-container">
                {`Huh? What the heck are u doing: ${caught.statusText}`}
            </div>
        );
    }
    throw new Error(`Unhandled error: ${caught.status}`);
}

export const ErrorBoundary = ({error}: { error: Error }) => {
    return (
        <>
            <section>
                <h5 className={"font-default-bold text-display-small tracking-tighter text-black"}>
                    {`Die Einladung kann nicht bearbeitet werden.`}
                </h5>
            </section>
            <section>
                {`${error.message}`}
            </section>
        </>
    );
}

export default InviteResponseView