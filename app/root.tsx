import type {LinksFunction, LoaderArgs, LoaderFunction, MetaFunction} from "@remix-run/node";
import {json} from "@remix-run/node";
import {
    Form,
    Links,
    LiveReload,
    Meta,
    NavLink,
    Outlet,
    Scripts,
    ScrollRestoration,
    useLoaderData,
    useLocation
} from "@remix-run/react";

import tailwindStylesheetUrl from "./styles/tailwind.css";
import {getUser} from "./session.server";
import {getGameById, getMostRecentGame} from "~/models/games.server";
import {authenticatePlayer} from "~/utils/session.server";
import {GameWithFeedback, UserAuthentication} from "~/config/applicationTypes";
import {DefaultFeedback, Player, User} from "@prisma/client";
import {getDefaultFeedback} from "~/models/feedback.server";
import BottomNavigationBar from "~/components/nav/BottomNavigationBar";
import React from "react";
import routeLinks from "~/config/routeLinks";
import TopNavBar from "~/components/nav/TopNavBar";
import {appMenu} from "~/components/nav/appMenu";
import {Toaster} from "react-hot-toast";
import PageHeader from "~/components/common/PageHeader";
import Subheading from "~/components/common/header/Subheading";

export const links: LinksFunction = () => {
    return [
        {rel: "stylesheet", href: tailwindStylesheetUrl},
        {rel: "stylesheet", href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css"}
    ];
};

export const meta: MetaFunction = () => ({
    charset: "utf-8",
    title: "DJK Kicker",
    viewport: "width=device-width,initial-scale=1",
});

type LoaderData = {
    user: User | null

    userAuthentication: UserAuthentication | null
    nextGame: GameWithFeedback | null

    defaultFeedback: DefaultFeedback | null
}

export const loader: LoaderFunction = async ({request}: LoaderArgs) => {
    const [user, mostRecentGame, userAuthentication] = await Promise.all([getUser(request), getMostRecentGame(), authenticatePlayer(request)])
    const nextGame = mostRecentGame ? await getGameById(mostRecentGame.id) : null
    let defaultFeedback: DefaultFeedback | null = null
    if (userAuthentication.player) {
        defaultFeedback = await getDefaultFeedback(userAuthentication.player.id)
    }

    return json<LoaderData>({
        user,
        nextGame,
        userAuthentication,
        defaultFeedback
    });
}

type RootScreenProps = {
    show: boolean
    nextGame: GameWithFeedback | null

    player: Player | null | undefined
}

const SummaryButton = ({nextGame}: { nextGame: GameWithFeedback }) => {
    return (
        <NavLink to={routeLinks.game(nextGame.id)}
                 className="w-full inline-flex items-center justify-center inline-block text-center pt-2 pb-1 sm:w-auto bg-gray-800 text-white rounded-lg px-4 py-2.5">
            <p className={"flex h-10 w-10 fa-solid fa-info items-center text-white justify-center rounded-full p-3 font-default-semibold transition ease-in-out"}/>
            <div className="text-left">
                <div className="mb-1 text-xs">Eine Übersicht für</div>
                <div className="-mt-1 font-sans text-xs">das nächste Spiel</div>
            </div>
        </NavLink>
    )
}

const CreatePlayerButton = ({nextGame}: { nextGame: GameWithFeedback | null | undefined }) => {
    const link = nextGame ? routeLinks.player.createForGame(nextGame.id) : routeLinks.player.create
    return (
        <NavLink to={link}
                 className="w-full inline-flex items-center justify-center inline-block text-center pt-2 pb-1 sm:w-auto bg-gray-800 text-white rounded-lg px-4 py-2.5">
            <p className={"flex h-10 w-10 fa-solid fa-user-plus items-center text-white justify-center rounded-full p-3 font-default-semibold transition ease-in-out"}/>
            <div className="text-left">
                <div className="mb-1 text-xs">Sei dabei und</div>
                <div className="-mt-1 font-sans text-xs">registriere Dich</div>
            </div>
        </NavLink>
    )
}

const ProfileButton = ({player}: { player: Player }) => {
    return (
        <NavLink to={routeLinks.player.profile(player.id)}
                 className="w-full inline-flex items-center justify-center inline-block text-center pt-2 pb-1 sm:w-auto bg-gray-800 text-white rounded-lg px-4 py-2.5">
            <p className={"flex h-10 w-10 fa-solid fa-user-large items-center text-white justify-center rounded-full p-3 font-default-semibold transition ease-in-out"}/>
            <div className="text-left">
                <div className="mb-1 text-xs">Deine persönlichen</div>
                <div className="-mt-1 font-sans text-xs">Einstellungen anpassen</div>
            </div>
        </NavLink>
    )
}

const DashboardButton = () => {
    return (
        <NavLink to={routeLinks.dashboard}
                 className="w-full inline-flex items-center justify-center inline-block text-center pt-2 pb-1 sm:w-auto bg-gray-800 text-white rounded-lg px-4 py-2.5">
            <p className={"flex h-10 w-10 fa-solid fa-futbol items-center text-white justify-center rounded-full p-3 font-default-semibold transition ease-in-out"}/>
            <div className="text-left">
                <div className="mb-1 text-xs">Rückmeldung für</div>
                <div className="-mt-1 font-sans text-xs">das nächste Spiel</div>
            </div>
        </NavLink>
    )

}

const RootScreen = ({show, nextGame, player}: RootScreenProps) => {
    if (!show) return null

    return (
        <div
            className="w-full p-4 text-center bg-blue-200 border shadow-md sm:p-8 mt-5">
            <PageHeader title={"Willkommen bei den DJK Kicker"}/>
            <div>
                <i className={"fa fa-futbol fa-bounce"}/>
                <Subheading
                    title={"Wenn Du noch nicht dabei bist, dann registriere Dich gleich als Spieler..."}/>
            </div>
            <div className="items-center justify-center space-y-4 sm:flex sm:space-y-0 sm:space-x-4 mt-5">
                <DashboardButton/>
                {nextGame && <SummaryButton nextGame={nextGame}/>}
                {player && <ProfileButton player={player}/>}
                <CreatePlayerButton nextGame={nextGame}/>
            </div>
        </div>
    )

}

export default function App() {
    const data = useLoaderData<LoaderData>() as LoaderData
    const {nextGame, user, userAuthentication} = data
    const player = userAuthentication?.player

    const location = useLocation()
    const rootScreen = location.pathname === "/"


    return (
        <html lang="en" className="bg-neutral-100">
        <head>
            <title>DJK Kicker</title>
            <Meta/>
            <Links/>
        </head>
        <body className="h-full">
        <div className="flex h-full min-h-screen flex-col">
            <div>
                <main className="flex h-full">
                    <div className="flex-1 p-4 px-4 lg:px-10">
                        <Toaster/>
                        <div className={"mb-20 md:mb-5"}>
                            <TopNavBar appMenu={appMenu.app} user={user ?? undefined}/>
                            <RootScreen show={rootScreen} nextGame={nextGame} player={player}/>
                            <Outlet/>
                            <Form method={"post"} action={routeLinks.application}>
                                <input type={"hidden"} name="nextGameId" value={nextGame?.id}/>
                                <input type={"hidden"} name="playerId" value={player?.id}/>
                                <BottomNavigationBar admin={user ?? undefined} game={nextGame}
                                                     player={player}/>
                            </Form>
                        </div>
                    </div>
                </main>
            </div>
        </div>
        <ScrollRestoration/>
        <Scripts/>
        <LiveReload/>
        </body>
        </html>
    );
}
