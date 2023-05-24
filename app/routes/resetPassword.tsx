import Subheading from "~/components/common/header/Subheading";
import * as React from "react";
import ContentContainer from "~/components/common/container/ContentContainer";
import messages from "~/components/i18n/messages";
import {Form, useActionData} from "@remix-run/react";
import {ActionArgs, json} from "@remix-run/node";
import {FormWrapper} from "~/utils/formWrapper.server";
import {changeUserPassword, getUserByEmail} from "~/models/user.server";
import BodyText from "~/components/common/header/BodyText";
import TransitionContainer from "~/components/common/container/transitionContainer";
import InputWithLabel from "~/components/common/form/InputWithLabel";

export type ResetPasswordFormFieldNames =
    "adminMail" | "securityCode" | "passwordNew"

export async function action({request}: ActionArgs) {
    const formData = await request.formData();
    const resetFormFields = new FormWrapper<ResetPasswordFormFieldNames>(formData)

    const adminMail = resetFormFields.get('adminMail')
    const securityCode = resetFormFields.get('securityCode')
    const passwordNew = resetFormFields.get('passwordNew')

    if (typeof adminMail !== "string" || adminMail.length === 0) {
        return json(
            {errors: {adminMail: "Mail ist notwendig"}},
            {status: 400}
        );
    }
    if (typeof securityCode !== "string" || securityCode.length === 0) {
        return json(
            {errors: {securityCode: "Sicherheitscode' ist notwendig"}},
            {status: 400}
        );
    }

    const user = await getUserByEmail(adminMail)
    if (!user) {
        return json(
            {errors: {adminMail: "Die eingegebenen Werte sind ungültig."}},
            {status: 400}
        );
    }
    if (user.securityCode !== securityCode) {
        return json(
            {errors: {adminMail: "Die eingegebenen Werte sind ungültig."}},
            {status: 400}
        );
    }

    if (typeof passwordNew !== 'string' || passwordNew.length < 8) {
        return json(
            {errors: {passwordNew: "Passwort ist zu kurz"}},
            {status: 400}
        );
    }
    await changeUserPassword(user.id, passwordNew)
    return json({success: {message: messages.resetPasswordForm.resetPasswordSuccess}}, {status: 200});
}

const ResetPassword = () => {
    const actionData = useActionData<typeof action>();

    return (
        <TransitionContainer>
            <ContentContainer className={'bg-blue-200'}>
                <div className="flex min-h-full flex-col justify-center">
                    <div className="mx-auto w-full max-w-md px-8">
                        <Subheading title={messages.resetPasswordForm.title} className={'mb-2'}/>
                    </div>
                    <Form method="post" className="space-y-6">
                        <div>
                            <InputWithLabel id={'adminMail'} type={'text'} name={'adminMail'} label={messages.resetPasswordForm.adminMail}/>
                            {actionData?.errors?.adminMail && (
                                <div className="pt-1 text-red-700" id="mail-error">
                                    {actionData.errors.adminMail}
                                </div>
                            )}
                        </div>
                        <div>
                            <InputWithLabel id={'securityCode'} type={'text'} name={'securityCode'} label={messages.resetPasswordForm.securityCode}/>
                            {actionData?.errors?.securityCode && (
                                <div className="pt-1 text-red-700" id="securityCode-error">
                                    {actionData.errors.securityCode}
                                </div>
                            )}
                        </div>

                        <div>
                            <InputWithLabel id={'passwordNew'}
                                            type={'password'} name={'passwordNew'}
                                            label={messages.resetPasswordForm.passwordNew}
                            />
                            {actionData?.errors?.passwordNew && (
                                <div className="pt-1 text-red-700" id="mail-error">
                                    {actionData.errors.passwordNew}
                                </div>
                            )}
                        </div>

                        <div>
                            {!!actionData?.success?.message && <BodyText title={messages.resetPasswordForm.resetPasswordSuccess} className={'mb-2 text-green-700'}/>}
                            {!!actionData?.errors && <BodyText title={messages.resetPasswordForm.resetPasswordFailed} className={'mb-2 text-red-700'}/>}
                        </div>

                        <button
                            type="submit"
                            className="w-full rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600"
                        >
                            {messages.resetPasswordForm.resetPassword}
                        </button>
                    </Form>
                </div>
            </ContentContainer>
        </TransitionContainer>
    )
}

export default ResetPassword