import {Form, useNavigate} from "@remix-run/react"
import DefaultButton from "~/components/common/buttons/DefaultButton";
import messages from "~/components/i18n/messages";
import InputWithLabel from "~/components/common/form/InputWithLabel";
import RedButton from "~/components/common/buttons/RedButton";
import ButtonContainer from "~/components/common/container/ButtonContainer";
import {DateTime} from "luxon";
import PageHeader from "~/components/common/PageHeader";
import dateUtils from "~/dateUtils";
import routeLinks from "~/helpers/constants/routeLinks";
import React from "react";

export type InviteUserResponseFormProps = {
    name?: string
    email?: string
    validUntil: DateTime
    errors: InviteUserResponseErrors
}

export type InviteUserResponseErrors = {
    adminName: string | null
    password: string | null
    passwordRepeat: string | null
}

const InviteUserResponseForm = ({email, name, validUntil, errors}: InviteUserResponseFormProps) => {
    const navigate = useNavigate()
    return (
        <>
            <header>
                <PageHeader title={messages.adminInviteUserResponseForm.title}/>
            </header>
            <Form method={"post"} className="md:w-1/2">
                <main className={"flex flex-col gap-4"}>
                    <InputWithLabel label={messages.adminInviteUserResponseForm.email}
                                    type='email'
                                    name={'email'}
                                    id={'email'}
                                    disabled={true}
                                    defaultValue={email || ''}
                    />
                    <InputWithLabel label={messages.adminInviteUserResponseForm.validUntil}
                                    type='text'
                                    name={'validUntil'}
                                    id={'validUntil'}
                                    disabled={true}
                                    defaultValue={dateUtils.dateToFormat({value: validUntil})}
                    />
                    <InputWithLabel label={messages.adminInviteUserResponseForm.name}
                                    type='text'
                                    name={'adminName'}
                                    id={'adminName'}
                                    defaultValue={name}
                                    error={errors?.adminName}
                    />
                    <InputWithLabel label={messages.adminInviteUserResponseForm.password}
                                    type='password'
                                    name={'password'}
                                    id={'password'}
                                    error={errors?.password}
                    />
                    <InputWithLabel label={messages.adminInviteUserResponseForm.passwordRepeat}
                                    type='password'
                                    name={'passwordRepeat'}
                                    id={'passwordRepeat'}
                                    error={errors?.passwordRepeat}
                    />
                    <ButtonContainer>
                        <RedButton>
                            <button onClick={() => navigate(routeLinks.games)}>{messages.appmenu.games}</button>
                        </RedButton>
                        <DefaultButton className='ml-auto'>
                            <button type={'submit'}>{messages.buttons.save}</button>
                        </DefaultButton>
                    </ButtonContainer>
                </main>
            </Form>
        </>
    )
}

export default InviteUserResponseForm