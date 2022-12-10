import {Form} from "@remix-run/react"
import DefaultButton from "~/components/common/buttons/DefaultButton";
import messages from "~/components/i18n/messages";
import InputWithLabel from "~/components/common/form/InputWithLabel";
import RedButton from "~/components/common/buttons/RedButton";
import ButtonContainer from "~/components/common/container/ButtonContainer";

export type CreateUserProps = {
    name?: string
    email?: string
}

const CreateUserForm = ({name, email}: CreateUserProps) => {
    return (
        <>
            <Form method={"post"}>
                <main className={"flex flex-col gap-4"}>
                    <InputWithLabel label={messages.adminCreateUserForm.name}
                                    type={'text'}
                                    name={'name'}
                                    id={'name'}
                                    defaultValue={name || ''}
                    />
                    <InputWithLabel label={messages.adminCreateUserForm.email}
                                    type='email'
                                    name={'email'}
                                    id={'email'}
                                    defaultValue={email || ''}
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

export default CreateUserForm