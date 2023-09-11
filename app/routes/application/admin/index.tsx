import {Form} from "@remix-run/react";
import messages from "~/components/i18n/messages";
import * as React from "react";
import {PropsWithChildren} from "react";
import {GamesImage, RatingsImage, ServerImage, UsersImage} from "~/components/images/adminImages";
import {ActionFunction, redirect} from "@remix-run/node";
import {Params} from "react-router";
import {FormWrapper} from "~/utils/formWrapper.server";
import invariant from "tiny-invariant";
import routeLinks from "~/config/routeLinks";
import {AdminActionButtonIntent, isAdminActionButtonIntent} from "~/components/game/admin/functionButtons/adminButtonTypes";

type AdminButtonProps = {
    intent: AdminActionButtonIntent
    label: string
    description: string
}

const AdminButton = ({intent, label, description, children}: PropsWithChildren<AdminButtonProps>) => {
    return (
        <button
            type={'submit'}
            name={'intent'}
            value={intent}
            className="p-10 flex flex-col items-center text-center group md:lg:xl:border-r md:lg:xl:border-b hover:bg-slate-50 cursor-pointer"
        >
            {children}
            <span className={"hidden lg:inline"}>{label}</span>
            <p className="mt-2 text-sm text-slate-500">{description}</p>
        </button>
    )
}

type AdminForm = 'intent'

export const action: ActionFunction = async ({params, request}: { params: Params, request: Request }) => {
    const formData = await request.formData();
    const wrapper = new FormWrapper<AdminForm>(formData)
    const intent = wrapper.get('intent')
    invariant(!!intent, "Kein Intent")
    invariant(isAdminActionButtonIntent(intent), `Ungültiger Intent: ${intent}`)
    if (isAdminActionButtonIntent(intent)) {
        switch (intent) {
            case "users":
                return redirect('users')
            case "games":
                return redirect('games')
            case "ratings":
                return redirect('teammatcher')
            case "server":
                return redirect('server')
            default:
                return redirect(routeLinks.admin.adminLandingPage)
        }
    }
}

const AdminIndex = () => {
    return (
        <Form method={'post'}>
            <div className="grid grid-cols-1 md:grid-cols-2 bg-white shadow-xl shadow-neutral-100 border px-3 ">
                <AdminButton intent={'games'} label={messages.adminLandingPage.games} description={messages.adminLandingPage.gamesDescription}>
                <span className="p-5 rounded-full bg-green-500 text-white shadow-lg shadow-green-200">
                    <GamesImage/>
                </span>
                </AdminButton>
                <AdminButton intent={'users'} label={messages.adminLandingPage.users} description={messages.adminLandingPage.usersDescription}>
                    <span className="p-5 rounded-full bg-orange-500 text-white shadow-lg shadow-orange-200">
                        <UsersImage/>
                    </span>
                </AdminButton>
                <AdminButton intent={'ratings'} label={messages.adminLandingPage.teamMatcher}
                             description={messages.adminLandingPage.teamMatcherDescription}>
                    <span className="p-5 rounded-full bg-blue-500 text-white shadow-lg shadow-blue-200">
                        <RatingsImage/>
                    </span>
                </AdminButton>
                <AdminButton intent={'server'} label={messages.adminLandingPage.server} description={messages.adminLandingPage.serverDescription}>
                    <span className="p-5 rounded-full bg-gray-500 text-white shadow-lg shadow-gray-200">
                        <ServerImage/>
                    </span>
                </AdminButton>
            </div>
        </Form>
    );
};

export default AdminIndex;