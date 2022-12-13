import type {LoaderFunction} from "@remix-run/node";
import {ActionFunction, json, redirect} from "@remix-run/node";
import {requireUserId} from "~/session.server";
import invariant from "tiny-invariant";
import InviteUserForm from "~/components/users/admin/InviteUserForm";
import dateUtils from "~/dateUtils";
import {DateTime} from "luxon";
import {createEncryptedAdminToken} from "~/utils/token.server";
import {createAdminInvitation} from "~/models/admin.user.invitation.server";
import {adminInvationMail} from "~/components/i18n/adminInvationMail";
import mailLinkBuilder from "~/helpers/mail/mailLinkBuilder";
import mailSender from "~/helpers/mail/mailsender";
import ErrorView from "~/components/errorhandling/ErrorView";
import {Outlet} from "@remix-run/react";


export const loader: LoaderFunction = async ({request}: { request: Request }) => {
    await requireUserId(request)
    return json({})
}

export const action: ActionFunction = async ({request}: { request: Request }) => {
    const formData = await request.formData();
    const intent = formData.get('intent')

    if (intent === 'cancel') {
        return redirect('application/admin/users')
    }

    const hostName = request.headers.get("host")!
    const email = formData.get("email")
    const adminName = formData.get('adminName')
    const scope = formData.get('scope')
    const validUnitTxt = formData.get('validUntil')?.toString() || ''
    const validUntil = dateUtils.dateFromFormat({text: validUnitTxt, options: {format: 'yyyy-MM-dd'}})

    invariant(typeof intent === "string", "Der Wert für den intent ist nicht gesetzt")
    invariant(typeof scope === "string", "Der Wert für scope ist nicht gesetzt")
    invariant(typeof adminName === "string", "Der Name ist ungültig")
    invariant(typeof email === "string", `Die Mail-Adresse ${email} ist ungültig`)
    invariant(email.includes('@'), `Die Mail-Adresse ${email} ist ungültig`)
    invariant(validUntil > DateTime.now(), `Datum ${validUnitTxt} muss in der Zukunft liegen`)

    const token = await createEncryptedAdminToken({
        email,
        expires_at: validUntil,
        preferred_username: adminName,
        scope
    })

    try {
        const invitation = await createAdminInvitation({
            name: adminName,
            scope,
            token,
            email,
            validUntil
        })

        const validUntilTxt = dateUtils.dateToFormat({value: validUntil})
        const einladungsLink = mailLinkBuilder.adminInvitationLink({host: hostName, inviteId: invitation.id, token})
        const subject = adminInvationMail.mailSubject({expiresAt: validUntilTxt})
        const mailTo = email
        const body = adminInvationMail.mailBody({expiresAt: validUntilTxt, adminName, einladungsLink})
        await mailSender.sendMail({mailTo, subject, body})
        return json({data: {invitation}})
    } catch (error) {
        console.log("ERROR SENDING MAIL", error)
        return json({data: error}, 500)
    }
}

export const NewAdmin = () => {
    return (
        <>
            <InviteUserForm/>
            <Outlet/>
        </>
    )
}

export const ErrorBoundary = ({error}: { error: Error }) => {
    return (
        <ErrorView error={error}/>
    )
}

export default NewAdmin