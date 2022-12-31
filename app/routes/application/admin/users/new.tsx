import type {LoaderFunction} from "@remix-run/node";
import {ActionFunction, json, redirect} from "@remix-run/node";
import {requireUserId} from "~/session.server";
import invariant from "tiny-invariant";
import {createUser} from "~/models/user.server";
import PageHeader from "~/components/common/PageHeader";
import messages from "~/components/i18n/messages";
import {Form} from "@remix-run/react";
import InputWithLabel from "~/components/common/form/InputWithLabel";
import ButtonContainer from "~/components/common/container/ButtonContainer";
import RedButton from "~/components/common/buttons/RedButton";
import DefaultButton from "~/components/common/buttons/DefaultButton";
import routeLinks from "~/helpers/constants/routeLinks";


export const loader: LoaderFunction = async ({request}: { request: Request }) => {
    await requireUserId(request)
    return json({})
}

export const action: ActionFunction = async ({request}: { request: Request }) => {
    await requireUserId(request)
    const formData = await request.formData();
    const userName = formData.get("name")
    const userMail = formData.get("email")
    const intent = formData.get('intent')
    const password = formData.get("password")
    const passwordRepeat = formData.get("passwordRepeat")

    invariant(typeof intent === "string")
    invariant(typeof userName === "string")
    invariant(typeof userMail === "string")
    invariant(typeof password === "string")
    invariant(typeof passwordRepeat === "string")
    invariant(password === passwordRepeat)

    if (intent === 'cancel') {
        return redirect(routeLinks.admin.users.home)
    }

    await createUser(userMail, password)
    return redirect(routeLinks.admin.users.home)
}

export const NewAdmin = () => {
    return (
        <>
            <header>
                <PageHeader title={messages.adminCreateUserForm.title}/>
            </header>
            <Form method={"post"}>
                <main className={"flex flex-col gap-4"}>
                    <InputWithLabel label={messages.adminCreateUserForm.name}
                                    type={'text'}
                                    name={'name'}
                                    id={'name'}
                                    defaultValue={''}
                    />
                    <InputWithLabel label={messages.adminCreateUserForm.email}
                                    type='email'
                                    name={'email'}
                                    id={'email'}
                                    defaultValue={''}
                    />
                    <InputWithLabel label={messages.adminCreateUserForm.password}
                                    type='password'
                                    name={'password'}
                                    id={'password'}
                    />
                    <InputWithLabel
                        label={messages.adminCreateUserForm.passwordRepeat}
                        type='password'
                        name={'passwordRepeat'}
                        id={'passwordRepeat'}
                    />
                    <ButtonContainer>
                        <RedButton>
                            <button name='intent' value={'cancel'} type={'submit'}>{messages.buttons.cancel}</button>
                        </RedButton>
                        <DefaultButton className='ml-auto'>
                            <button type={'submit'} name={'intent'} value='save'>{messages.buttons.save}</button>
                        </DefaultButton>
                    </ButtonContainer>

                </main>
            </Form>
        </>
    )
}

export default NewAdmin