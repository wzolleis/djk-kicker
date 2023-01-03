import {Form, Outlet, useCatch, useLoaderData, useNavigate} from "@remix-run/react";
import TopNavBar from "~/components/nav/TopNavBar";
import {appMenu} from "~/components/nav/appMenu";
import {useOptionalUser} from "~/utils";
import {Toaster} from "react-hot-toast";
import DefaultButton from "~/components/common/buttons/DefaultButton";
import routeLinks from "~/helpers/constants/routeLinks";
import messages from "~/components/i18n/messages";
import React from "react";
import PageHeader from "~/components/common/PageHeader";
import ErrorComponent from "~/components/common/error/ErrorComponent";
import BottomNavigationBar from "~/components/nav/BottomNavigationBar";
import {ActionFunction, json, LoaderFunction, redirect} from "@remix-run/node";
import {authenticatePlayer} from "~/utils/session.server";
import {getGameById, getMostRecentGame} from "~/models/games.server";
import {getDefaultFeedback} from "~/models/feedback.server";
import {DefaultFeedback, Player} from "@prisma/client";
import {GameWithFeedback} from "~/config/gameTypes";
import {getNavigationFormValues, isNavigationIntent} from "~/config/bottomNavigation";
import invariant from "tiny-invariant";


export const action: ActionFunction = async ({params, request}) => {
    const {isAuthenticated, player} = await authenticatePlayer(params, request);
    const nextGame = await getMostRecentGame();
    const nextGameWithFeedBack = !!nextGame ? await getGameById(nextGame.id) : undefined

    const formData = await request.formData();
    const formValues = getNavigationFormValues(formData)
    const intent = formValues.get("intent")
    invariant(typeof intent === "string", "invalid intent type")
    invariant(isNavigationIntent(intent), "invalid intent")
    invariant(!!player, "kein Player")
    invariant(!!nextGame, "Kein Spiel")

    const gameId = nextGame.id
    const playerId = player.id

    switch (intent) {
        case "profile":
            return redirect(routeLinks.player.profile(playerId))
        case "home":
            return redirect(routeLinks.dashboard)
        case "game":
            return redirect(routeLinks.game(gameId))
        case "administration":
            return redirect(routeLinks.admin.adminLandingPage)
        case "registration":
            const createPlayerLink = gameId ? routeLinks.player.createForGame(gameId) : routeLinks.player.create
            return redirect(createPlayerLink)
        default:
            return redirect(routeLinks.dashboard)
    }
}

export type ApplicationLoaderData = {
    isAuthenticated: boolean;
    player?: Player
    nextGame?: GameWithFeedback;
    defaultFeedback?: DefaultFeedback
}

export const loader: LoaderFunction = async ({params, request}) => {
    const {isAuthenticated, player} = await authenticatePlayer(params, request);
    const nextGame = await getMostRecentGame();
    const nextGameWithFeedBack = !!nextGame ? await getGameById(nextGame.id) : undefined
    const defaultFeedback = player?.id ? await getDefaultFeedback(player?.id) : undefined

    return json<ApplicationLoaderData>({
        isAuthenticated,
        player: player ?? undefined,
        defaultFeedback,
        nextGame: nextGameWithFeedBack ?? undefined
    });
};


const Application = () => {
    const user = useOptionalUser();

    const data = useLoaderData<typeof loader>();
    // console.log(">>>> application data = ", JSON.stringify(data, undefined, 2 ))

    return (
        <div className="flex h-full min-h-screen flex-col">
            <TopNavBar appMenu={appMenu.app} user={user}/>
            <div>
                <main className="flex h-full">
                    <div className="flex-1 p-4 px-4 lg:px-10">
                        <Toaster/>
                        <div className={"mb-20 md:mb-5"}>
                            <Outlet/>
                        </div>
                        <Form method={"post"}>
                            <BottomNavigationBar admin={user}/>
                        </Form>
                    </div>
                </main>
            </div>
        </div>
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
