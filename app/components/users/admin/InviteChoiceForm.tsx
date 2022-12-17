import PageHeader from "~/components/common/PageHeader";
import messages from "~/components/i18n/messages";
import InputWithLabel from "~/components/common/form/InputWithLabel";
import dateUtils from "~/dateUtils";
import {Form} from "@remix-run/react";
import {DateTime} from "luxon";
import RedButton from "~/components/common/buttons/RedButton";
import ButtonContainer from "~/components/common/container/ButtonContainer";
import SuccessButton from "~/components/common/buttons/SuccessButton";


export type InviteChoiceFormProps = {
    name: string
    email: string
    validUntil: DateTime
}

const InviteChoiceForm = ({name, email, validUntil}: InviteChoiceFormProps) => {
    return (
        <>
            <header>
                <PageHeader title={messages.adminInviteUserChoiceForm.title}/>
            </header>
            <Form method={"post"} className="md:w-1/2">
                <main className={"flex flex-col gap-4"}>
                    <InputWithLabel label={messages.adminInviteUserChoiceForm.email}
                                    type='email'
                                    name={'email'}
                                    id={'email'}
                                    disabled={true}
                                    defaultValue={email || ''}
                    />
                    <InputWithLabel label={messages.adminInviteUserChoiceForm.validUntil}
                                    type='text'
                                    name={'validUntil'}
                                    id={'validUntil'}
                                    disabled={true}
                                    defaultValue={dateUtils.dateToFormat({value: validUntil})}
                    />
                    <InputWithLabel label={messages.adminInviteUserChoiceForm.name}
                                    type='text'
                                    name={'adminName'}
                                    id={'adminName'}
                                    defaultValue={name}
                    />
                    <ButtonContainer>
                        <RedButton>
                            <button name='intent' value={'reject'}
                                    type={'submit'}>{messages.adminInviteUserChoiceForm.rejectInvitation}</button>
                        </RedButton>
                        <SuccessButton className='ml-auto'>
                            <button type={'submit'} name={'intent'} value='accept'>{messages.adminInviteUserChoiceForm.acceptInvitation}</button>
                        </SuccessButton>
                    </ButtonContainer>
                </main>
            </Form>
        </>
    )
}

export default InviteChoiceForm