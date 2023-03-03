import type {ActionArgs, LoaderArgs, MetaFunction} from "@remix-run/node";
import {json, LoaderFunction, redirect} from "@remix-run/node";
import {Form, useActionData, useLoaderData, useSearchParams} from "@remix-run/react";
import * as React from "react";

import {getUserId} from "~/session.server";
import {changeUserPassword, getUserById, verifyPassword} from "~/models/user.server";
import messages from "~/components/i18n/messages";
import routeLinks from "~/config/routeLinks";
import ContentContainer from "~/components/common/container/ContentContainer";
import Subheading from "~/components/common/header/Subheading";
import {User} from "@prisma/client";
import BodyText from "~/components/common/header/BodyText";

type LoaderData = {
    user: User
}

export const loader: LoaderFunction = async ({request}: LoaderArgs) => {
    const userId = await getUserId(request);

    if (!!userId) {
        const user = await getUserById(userId)
        return json({user})
    }

    return redirect('/login');
}

export async function action({request}: ActionArgs) {
    const userId = await getUserId(request);
    if (!userId) {
        return redirect('/login')
    }

    const formData = await request.formData();
    const passwordNew = formData.get("passwordNew");
    const passwordRepeat = formData.get("passwordRepeat");
    const actualPassword = formData.get("actualPassword")

    if (typeof actualPassword !== "string" || actualPassword.length === 0) {
        return json(
            {errors: {passwordNew: "Aktuelles Passwort ist notwendig"}},
            {status: 400}
        );
    }

    if (typeof passwordNew !== "string" || passwordNew.length === 0) {
        return json(
            {errors: {passwordNew: "Neues Passwort ist notwendig"}},
            {status: 400}
        );
    }

    if (passwordNew.length < 8) {
        return json(
            {errors: {passwordNew: "Passwort ist zu kurz"}},
            {status: 400}
        );
    }

    if (passwordNew !== passwordRepeat) {
        return json(
            {errors: {passwordNew: "Passwörter stimmen nicht überein"}},
            {status: 400}
        );
    }

    const passwordMatch = await verifyPassword(userId, actualPassword)

    if (!passwordMatch) {
        return json(
            {errors: {passwordNew: "Aktuelles Passwort stimmt nicht"}},
            {status: 400}
        );
    }

    await changeUserPassword(userId, passwordNew)
    return json({errors: {passwordNew: null}})
}

export const meta: MetaFunction = () => {
    return {
        title: "Login",
    };
};

export default function ChangePassword() {
    const [searchParams] = useSearchParams();
    const redirectTo = searchParams.get("redirectTo") || routeLinks.dashboard;
    const actionData = useActionData<typeof action>();
    const passwordRef = React.useRef<HTMLInputElement>(null);

    // TS LoaderData/ActionData mit 'as unknown as ActionData' - > siehe https://github.com/remix-run/remix/issues/3931
    const loaderData = useLoaderData<LoaderData>() as unknown as LoaderData | undefined
    const userName = loaderData?.user?.name ?? ''

    React.useEffect(() => {
        if (actionData?.errors?.passwordNew) {
            passwordRef.current?.focus();
        }
    }, [actionData]);

    return (
        <ContentContainer className={'bg-blue-200'}>
            <div className="flex min-h-full flex-col justify-center">
                <div className="mx-auto w-full max-w-md px-8">
                    <Subheading title='Passwort ändern' className={'mb-2'}/>
                    <BodyText title={'Angemeldet: ' + userName} className={'mb-2'}/>

                    <Form method="post" className="space-y-6">
                        <div>
                            <label
                                htmlFor="actualPassword"
                                className="block text-sm font-medium text-gray-700"
                            >
                                {messages.changePasswordForm.actualPassword}
                            </label>
                            <div className="mt-1">
                                <input
                                    id="actualPassword"
                                    name="actualPassword"
                                    type="password"
                                    autoComplete="actual-password"
                                    className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
                                />
                            </div>
                        </div>
                        <div>
                            <label
                                htmlFor="passwordNew"
                                className="block text-sm font-medium text-gray-700"
                            >
                                {messages.changePasswordForm.passwordNew}
                            </label>
                            <div className="mt-1">
                                <input
                                    id="passwordNew"
                                    ref={passwordRef}
                                    name="passwordNew"
                                    type="password"
                                    autoComplete="new-password"
                                    aria-invalid={actionData?.errors?.passwordNew ? true : undefined}
                                    aria-describedby="password-error"
                                    className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
                                />
                                {actionData?.errors?.passwordNew && (
                                    <div className="pt-1 text-red-700" id="password-error">
                                        {actionData.errors.passwordNew}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div>
                            <label
                                htmlFor="passwordRepeat"
                                className="block text-sm font-medium text-gray-700"
                            >
                                {messages.changePasswordForm.passwordRepeat}
                            </label>
                            <div className="mt-1">
                                <input
                                    id="passwordRepeat"
                                    name="passwordRepeat"
                                    type="password"
                                    autoComplete="repeat-password"
                                    aria-describedby="password-repeat-error"
                                    className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
                                />
                            </div>
                        </div>

                        <input type="hidden" name="redirectTo" value={redirectTo}/>
                        <button
                            type="submit"
                            className="w-full rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
                        >
                            {messages.changePasswordForm.changePassword}
                        </button>
                    </Form>
                </div>
            </div>
        </ContentContainer>
    );
}
