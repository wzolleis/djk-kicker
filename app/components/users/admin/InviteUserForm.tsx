import {Form} from "@remix-run/react"
import DefaultButton from "~/components/common/buttons/DefaultButton";
import messages from "~/components/i18n/messages";
import InputWithLabel from "~/components/common/form/InputWithLabel";
import RedButton from "~/components/common/buttons/RedButton";
import ButtonContainer from "~/components/common/container/ButtonContainer";
import {DateInput, formatForDatePicker} from "~/components/common/datetime/datetime";
import {DateTime} from "luxon";
import {useState} from "react";
import PageHeader from "~/components/common/PageHeader";
import dateUtils from "~/dateUtils";

export type CreateUserProps = {
    name?: string
    email?: string
}

const CreateUserForm = ({email}: CreateUserProps) => {
    const [dateValue, setDateValue] = useState<DateTime>(DateTime.now().endOf('day').plus({day: 7}))

    const onDateValueSelect = (value: string) => {
        const datePickerValue =dateUtils.dateFromFormat({text: value})
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
                                    defaultValue={email || ''}
                                    required={true}
                    />
                    <InputWithLabel label={messages.adminInviteUserForm.name}
                                    type='text'
                                    name={'adminName'}
                                    id={'adminName'}
                                    required={true}
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