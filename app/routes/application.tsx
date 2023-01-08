import {Outlet, useCatch, useNavigate} from "@remix-run/react";
import DefaultButton from "~/components/common/buttons/DefaultButton";
import routeLinks from "~/config/routeLinks";
import messages from "~/components/i18n/messages";
import React from "react";
import PageHeader from "~/components/common/PageHeader";
import ErrorComponent from "~/components/common/error/ErrorComponent";
import {ActionFunction, json, LoaderFunction, redirect} from "@remix-run/node";
import {authenticatePlayer} from "~/utils/session.server";
import {getDefaultFeedback} from "~/models/feedback.server";
import {getNavigationFormValues, isNavigationIntent} from "~/config/bottomNavigation";
import invariant from "tiny-invariant";


export const action: ActionFunction = async ({ request}) => {
    const formData = await request.formData();
    const formValues = getNavigationFormValues(formData)
    const intent = formValues.get("intent")
    const gameId = formValues.get("nextGameId")
    const playerId = formValues.get("playerId")
    invariant(typeof intent === "string", "invalid intent type")
    invariant(typeof gameId === "string", "invalid gameId type")
    invariant(typeof playerId === "string", "invalid playerId type")
    invariant(isNavigationIntent(intent), "invalid intent")

    switch (intent) {
        case "profile":
            if (!!playerId) {
                return redirect(routeLinks.player.profile(playerId))
            }
            break
        case "home":
            return redirect(routeLinks.dashboard)
        case "game":
            if (!!gameId) {
                return redirect(routeLinks.game(gameId))
            }
            break
        case "administration":
            return redirect(routeLinks.admin.adminLandingPage)
        case "registration":
            const createPlayerLink = gameId ? routeLinks.player.createForGame(gameId) : routeLinks.player.create
            return redirect(createPlayerLink)
        default:
            return redirect(routeLinks.dashboard)
    }
    return redirect(routeLinks.dashboard)
}

export type ApplicationLoaderData = {
    defaultFeedback?: Awaited<ReturnType<typeof getDefaultFeedback>>
}

export const loader: LoaderFunction = async ({ request}) => {
    const userAuthentication = await authenticatePlayer(request);
    const {player} = userAuthentication
    const defaultFeedback = player?.id ? await getDefaultFeedback(player?.id) : undefined

    return json<ApplicationLoaderData>({
        defaultFeedback,
    });
};


const Application = () => {
    return (
        <Outlet/>
    );
};

export const CatchBoundary = () => {
    const navigate = useNavigate();
    const caught = useCatch();
    return (
        <div>
            <PageHeader title={`Es ist ein Fehler aufgetreten: ${caught.statusText}`}/>
            <DefaultButton className={"m-5 flex justify-start"}>
                <button onClick={() => navigate(routeLinks.dashboard)}>{messages.appmenu.dashboard}</button>
            </DefaultButton>
        </div>
    );
};

export const ErrorBoundary = () => {
    return <ErrorComponent/>;
};

export default Application;
