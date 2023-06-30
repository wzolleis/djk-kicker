import {ActionFunction, json, LoaderFunction, redirect,} from "@remix-run/node";
import {isRouteErrorResponse, Outlet, useRouteError} from "@remix-run/react";
import React from "react";
import invariant from "tiny-invariant";
import ErrorComponent from "~/components/common/error/ErrorComponent";
import {getNavigationFormValues, isNavigationIntent,} from "~/config/bottomNavigation";
import routeLinks from "~/config/routeLinks";
import {getDefaultFeedback} from "~/models/feedback.server";
import {authenticatePlayer} from "~/utils/session.server";

export const action: ActionFunction = async ({request}) => {
    const formData = await request.formData();
    const formValues = getNavigationFormValues(formData);
    const intent = formValues.get("intent");
    const gameId = formValues.get("nextGameId");
    const playerId = formValues.get("playerId");
    invariant(typeof intent === "string", "invalid intent type");
    invariant(typeof gameId === "string", "invalid gameId type");
    invariant(typeof playerId === "string", "invalid playerId type");
    invariant(isNavigationIntent(intent), "invalid intent");

    switch (intent) {
        case "profile":
            if (!!playerId) {
                return redirect(routeLinks.player.profile(playerId));
            }
            break;
        case "home":
            return redirect(routeLinks.dashboard);
        case 'rescue':
            return redirect(routeLinks.player.rescue)
        case 'rating':
            return redirect(routeLinks.player.rating)
        case "game":
            if (!!gameId) {
                return redirect(routeLinks.game(gameId));
            }
            break;
        case "administration":
            return redirect(routeLinks.admin.adminLandingPage);
        case "registration":
            const createPlayerLink = gameId
                ? routeLinks.player.createForGame(gameId)
                : routeLinks.player.create;
            return redirect(createPlayerLink);
        default:
            return redirect(routeLinks.dashboard);
    }
    return redirect(routeLinks.dashboard);
};

export type ApplicationLoaderData = {
    defaultFeedback?: Awaited<ReturnType<typeof getDefaultFeedback>>;
};

export const loader: LoaderFunction = async ({request}) => {
    const {playerId} = await authenticatePlayer(request);
    const defaultFeedback = playerId
        ? await getDefaultFeedback(playerId)
        : undefined;

    return json<ApplicationLoaderData>({
        defaultFeedback,
    });
};

const Application = () => {
    return <Outlet/>;
};

export const ErrorBoundary = () => {
    const error = useRouteError();
    if (isRouteErrorResponse(error)) {
        return <ErrorComponent title={'Fehler'} message={error.statusText}/>
    }

    return <ErrorComponent/>;
};

export default Application;
