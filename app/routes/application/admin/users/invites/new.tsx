import type {LoaderFunction} from "@remix-run/node";
import {ActionFunction, json, redirect} from "@remix-run/node";
import {requireUserId} from "~/session.server";
import invariant from "tiny-invariant";
import dateUtils from "~/dateUtils";
import {DateTime} from "luxon";
import {createEncryptedAdminToken} from "~/utils/token.server";
import {createAdminInvitation} from "~/models/admin.user.invitation.server";
import {adminInvationMail} from "~/components/i18n/adminInvationMail";
import mailLinkBuilder from "~/helpers/mail/mailLinkBuilder";
import mailSender from "~/helpers/mail/mailsender";
import ErrorView from "~/components/errorhandling/ErrorView";
import {Form, Outlet} from "@remix-run/react";
import PageHeader from "~/components/common/PageHeader";
import messages from "~/components/i18n/messages";
import InputWithLabel from "~/components/common/form/InputWithLabel";
import {DateInput, formatForDatePicker} from "~/components/common/datetime/datetime";
import ButtonContainer from "~/components/common/container/ButtonContainer";
import RedButton from "~/components/common/buttons/RedButton";
import DefaultButton from "~/components/common/buttons/DefaultButton";
import {useState} from "react";
import routeLinks from "~/config/routeLinks";
import SubmitButton from "~/components/common/buttons/submitButton";


export const loader: LoaderFunction = async ({request}: { request: Request }) => {
    await requireUserId(request)
    return json({})
}

export const action: ActionFunction = async ({request}: { request: Request }) => {
    await requireUserId(request)
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
        return redirect(routeLinks.admin.users.home)
    } catch (error) {
        console.log("ERROR SENDING MAIL", error)
        return json({data: error}, 500)
    }
}

export const NewAdmin = () => {
    const [dateValue, setDateValue] = useState<DateTime>(DateTime.now().endOf('day').plus({day: 7}))

    const onDateValueSelect = (value: string) => {
        const datePickerValue = dateUtils.dateFromFormat({text: value, options: {format: dateUtils.datePickerFormat}})
        setDateValue(dateValue.set({
            year: datePickerValue.year,
            month: datePickerValue.month,
            day: datePickerValue.day
        }))
    }

    return (
        <>
            <header>
                <PageHeader title={messages.adminInviteUserForm.title}/>
            </header>
            <Form method={"post"} className="w-1/2">
                <main className={"flex flex-col gap-4"}>
                    <InputWithLabel label={messages.adminInviteUserForm.email}
                                    type='email'
                                    name={'email'}
                                    id={'email'}
                                    defaultValue={''}
                    />
                    <InputWithLabel label={messages.adminInviteUserForm.name}
                                    type='text'
                                    name={'adminName'}
                                    id={'adminName'}
                    />
                    <DateInput onChange={onDateValueSelect}
                               value={formatForDatePicker(dateValue)}
                               name='validUntil'
                               label={messages.adminInviteUserForm.validUntil}
                    />
                    <InputWithLabel label={messages.adminInviteUserForm.scope}
                                    type='text'
                                    name={'scope'}
                                    id={'scope'}
                                    defaultValue='admin'
                    />

                    <ButtonContainer>
                        <RedButton>
                            <SubmitButton label={messages.buttons.cancel}
                                          loadingLabel={messages.buttons.cancel}
                                          savingLabel={messages.buttons.cancel}
                                          name={"intent"}
                                          value={"cancel"}
                            />
                        </RedButton>
                        <DefaultButton className='ml-auto'>
                            <SubmitButton label={messages.buttons.save}
                                          loadingLabel={messages.buttons.save}
                                          name={"intent"}
                                          value={"save"}
                            />
                        </DefaultButton>
                    </ButtonContainer>

                </main>
            </Form>
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