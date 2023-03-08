import ContentContainer from "~/components/common/container/ContentContainer";
import PageHeader from "~/components/common/PageHeader";
import messages from "~/components/i18n/messages";
import {Form, useActionData} from "@remix-run/react";
import InputWithLabel from "~/components/common/form/InputWithLabel";
import * as React from "react";
import Subheading from "~/components/common/header/Subheading";
import RedButton from "~/components/common/buttons/RedButton";
import DefaultButton from "~/components/common/buttons/DefaultButton";
import {ActionFunction, json, redirect} from "@remix-run/node";
import {FormWrapper} from "~/utils/formWrapper.server";
import routeLinks from "~/config/routeLinks";
import {getPlayerByMail} from "~/models/player.server";
import {destroyPlayerSession} from "~/utils/session.server";

type ActionData = {
    error: {
        email: string | null
        intent: string | null
    } | undefined,
    info: {
        message: string
    } | undefined
}

type RescueFormData = 'intent' | 'email'
type RescueFormIntent = 'cancel' | 'deleteCookie'
const isRescueFormIntent = (value: any): value is RescueFormIntent => {
    return value === 'cancel' || value === 'deleteCookie'
}

const emptyActionData: ActionData = {
    error: undefined,
    info: undefined
}

export const action: ActionFunction = async ({request}: { request: Request }) => {
    const formData = await request.formData();
    const wrapper = new FormWrapper<RescueFormData>(formData)
    const intent = wrapper.get('intent')
    const email = wrapper.get('email')

    console.group('rescue form')
    console.info('intent = ', intent)
    console.info('email = ', email)

    if (intent === 'cancel') {
        return redirect(routeLinks.dashboard)
    }

    try {
        if (typeof email !== 'string') {
            return json<ActionData>({
                ...emptyActionData,
                error: {
                    email: 'Ungültige Mail',
                    intent: null
                }
            })
        }
        if (email === '' || email == null) {
            console.info('Email adresse fehlt')
            return json<ActionData>({
                ...emptyActionData,
                error: {
                    email: 'Die Mailadresse ist ein Pflichtfeld',
                    intent: null
                }
            })
        }


        if (!isRescueFormIntent(intent)) {
            return json<ActionData>({
                ...emptyActionData,
                error: {
                    email: null,
                    intent: 'Unbekannte Aktion: ' + intent
                }
            })
        }
        if (intent === 'deleteCookie') {
            const player = await getPlayerByMail(email)
            console.log('player = ', player)
            if (!player) {
                return json<ActionData>({
                    ...emptyActionData,
                    error: {
                        email: 'Unbekannte Mailadresse',
                        intent: null
                    },
                    info: undefined
                })
            }

            const result = await destroyPlayerSession(request)
            console.info('result = ', result)
            return redirect(
                '/',
                {
                    headers: {
                        'Set-Cookie': result
                    },
                }
            );
        }
    } finally {
        console.info('resue form - end')
        console.groupEnd()
    }
}

const Rescue = () => {
    const actionData = useActionData<ActionData>() as unknown as ActionData;
    return (
        <>
            <ContentContainer className={'bg-yellow-200'}>
                <div>
                    <PageHeader title={messages.playerRescueForm.title}/>
                    <Subheading title={messages.playerRescueForm.rescueDescription} className={'pl-5'}/>
                </div>
                <Form method="post" className={'my-5'}>
                    <ContentContainer>
                        <div className={"flex flex-col items-start px-3 py-2"}>
                            <InputWithLabel id={'email'} type={'text'} name={'email'} label={messages.playerRescueForm.email}/>
                        </div>
                        {actionData?.error?.email &&
                            <div className="pt-1 text-red-700">
                                {actionData?.error.email}
                            </div>
                        }
                    </ContentContainer>
                    <ContentContainer className={'bg-red-200 my-5'}>
                        <div className={"flex flex-row gap-5 items-start px-3 py-2"}>
                            <Subheading title={messages.playerRescueForm.deleteCookieDescription}/>
                            <RedButton className={'ml-auto'}>
                                <button name={'intent'} value={'deleteCookie'}>{messages.buttons.delete}</button>
                            </RedButton>
                        </div>
                    </ContentContainer>
                    {actionData?.error?.intent &&
                        (
                            <div className="pt-1 text-red-700">
                                {actionData?.error.intent}
                            </div>
                        )
                    }
                    <div className={"flex justify-start gap-2 pt-2"}>
                        <DefaultButton className={'ml-auto'}>
                            <button name='intent' value={'cancel'} type={'submit'}>{messages.buttons.cancel}</button>
                        </DefaultButton>
                    </div>
                </Form>
            </ContentContainer>
            {actionData?.info?.message &&
                <ContentContainer className={'my-5'}>
                    {actionData?.info.message}
                </ContentContainer>
            }
        </>
    )
}

export default Rescue