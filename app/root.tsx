import type {LinksFunction, LoaderArgs, LoaderFunction, MetaFunction,} from "@remix-run/node";
import {json} from "@remix-run/node";
import {Form, Links, LiveReload, Meta, NavLink, Outlet, Scripts, ScrollRestoration, useLoaderData, useLocation,} from "@remix-run/react";

import {DefaultFeedback, Player, User} from "@prisma/client";
import React from "react";
import {Toaster} from "react-hot-toast";
import {GameBanner} from "~/components/common/header/pageBanner";
import Subheading from "~/components/common/header/Subheading";
import {appMenu} from "~/components/nav/appMenu";
import BottomNavigationBar from "~/components/nav/BottomNavigationBar";
import TopNavBar from "~/components/nav/TopNavBar";
import {GameWithFeedback,} from "~/config/applicationTypes";
import routeLinks from "~/config/routeLinks";
import {getDefaultFeedback} from "~/models/feedback.server";
import {getGameById, getMostRecentGame} from "~/models/games.server";
import {getPlayerById, getPlayers} from "~/models/player.server";
import {getPlayerGreeting} from "~/utils";
import {authenticatePlayer} from "~/utils/session.server";
import {getUser} from "./session.server";
import tailwindStylesheetUrl from "./styles/tailwind.css";
import messages from "~/components/i18n/messages";

export const links: LinksFunction = () => {
    return [
        { rel: "stylesheet", href: tailwindStylesheetUrl },
        {
            rel: "stylesheet",
            href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css",
        },
    ];
};

export const meta: MetaFunction = () => ({
    charset: "utf-8",
    title: "DJK Kicker",
    viewport: "width=device-width,initial-scale=1",
});

type LoaderData = {
    user: User | null;

    player: Player | null;
    nextGame: GameWithFeedback | null;

    players: Player[];

    defaultFeedback: DefaultFeedback | null;
};

export const loader: LoaderFunction = async ({ request }: LoaderArgs) => {
    try {
        const [user, mostRecentGame, { playerId }] = await Promise.all([
            getUser(request),
            getMostRecentGame(),
            authenticatePlayer(request),
        ]);
        const nextGame = mostRecentGame
            ? await getGameById(mostRecentGame.id)
            : null;
        let defaultFeedback: DefaultFeedback | null = null;
        if (playerId) {
            defaultFeedback = await getDefaultFeedback(playerId);
        }
        const players = await getPlayers();
        const player = playerId ? await getPlayerById(playerId) : null;

        return json<LoaderData>({
            user,
            nextGame,
            player,
            defaultFeedback,
            players,
        });
    } catch (error) {
        console.error(">>>>>>>>>> error in root loader", error);
        return json<LoaderData>({
            user: null,
            nextGame: null,
            player: null,
            defaultFeedback: null,
            players: [],
        });
    }
};

type RootScreenProps = {
    show: boolean;
    nextGame: GameWithFeedback | null;

    player: Player | null | undefined;
};

const SummaryButton = ({ nextGame }: { nextGame: GameWithFeedback }) => {
    return (
        <NavLink
            to={routeLinks.game(nextGame.id)}
            className="inline-block inline-flex w-full items-center justify-center rounded-lg bg-gray-800 px-4 py-2.5 pt-2 pb-1 text-center text-white sm:w-auto">
            <p
                className={
                    "fa-solid fa-info flex h-10 w-10 items-center justify-center rounded-full p-3 font-default-semibold text-white transition ease-in-out"
                }
            />
            <div className="text-left">
                <div className="mb-1 text-xs">Eine Übersicht für</div>
                <div className="-mt-1 font-sans text-xs">das nächste Spiel</div>
            </div>
        </NavLink>
    );
};

const CreatePlayerButton = ({
    nextGame,
}: {
    nextGame: GameWithFeedback | null | undefined;
}) => {
    const link = nextGame
        ? routeLinks.player.createForGame(nextGame.id)
        : routeLinks.player.create;
    return (
        <NavLink
            to={link}
            className="inline-block inline-flex w-full items-center justify-center rounded-lg bg-gray-800 px-4 py-2.5 pt-2 pb-1 text-center text-white sm:w-auto">
            <p
                className={
                    "fa-solid fa-user-plus flex h-10 w-10 items-center justify-center rounded-full p-3 font-default-semibold text-white transition ease-in-out"
                }
            />
            <div className="text-left">
                <div className="mb-1 text-xs">Sei dabei und</div>
                <div className="-mt-1 font-sans text-xs">registriere Dich</div>
            </div>
        </NavLink>
    );
};

const ProfileButton = ({ player }: { player: Player }) => {
    return (
        <NavLink
            to={routeLinks.player.profile(player.id)}
            className="inline-block inline-flex w-full items-center justify-center rounded-lg bg-gray-800 px-4 py-2.5 pt-2 pb-1 text-center text-white sm:w-auto">
            <p
                className={
                    "fa-solid fa-user-large flex h-10 w-10 items-center justify-center rounded-full p-3 font-default-semibold text-white transition ease-in-out"
                }
            />
            <div className="text-left">
                <div className="mb-1 text-xs">Deine persönlichen</div>
                <div className="-mt-1 font-sans text-xs">
                    Einstellungen anpassen
                </div>
            </div>
        </NavLink>
    );
};

const DashboardButton = () => {
    return (
        <NavLink
            to={routeLinks.dashboard}
            className="inline-block inline-flex w-full items-center justify-center rounded-lg bg-gray-800 px-4 py-2.5 pt-2 pb-1 text-center text-white sm:w-auto">
            <p
                className={
                    "fa-solid fa-futbol flex h-10 w-10 items-center justify-center rounded-full p-3 font-default-semibold text-white transition ease-in-out"
                }
            />
            <div className="text-left">
                <div className="mb-1 text-xs">Rückmeldung für</div>
                <div className="-mt-1 font-sans text-xs">das nächste Spiel</div>
            </div>
        </NavLink>
    );
};

const RootScreen = ({ show, nextGame, player }: RootScreenProps) => {
    if (!show) return null;

    return (
        <div className="mt-5 w-full border bg-blue-200 p-4 text-center shadow-md sm:p-8">
            <div className={"flex justify-center gap-2"}>
                <Subheading
                    title={
                        "Hier kannst dich registrieren, deine Einstellungen verwalten oder einfach nur nachschauen, wer alles kommt..."
                    }
                />
            </div>
            <div className="mt-5 items-center justify-center space-y-4 sm:flex sm:space-y-0 sm:space-x-4">
                {player && <DashboardButton />}
                {nextGame && <SummaryButton nextGame={nextGame} />}
                {player && <ProfileButton player={player} />}
                <CreatePlayerButton nextGame={nextGame} />
            </div>
        </div>
    );
};

const Greeting = ({
    showGreeting,
    player,
}: {
    showGreeting: boolean;
    player?: Player | null | undefined;
}) => {
    if (!showGreeting) return null;

    const greeting = `${(!!player && getPlayerGreeting(player.name)) || ""}`;
    return <Subheading title={greeting} />;
};

export function ErrorBoundary({ error }: { error: any }) {
    return (
        <div>
            <h1>Error</h1>
            <p>{error.message}</p>
            <p>The stack trace is:</p>
            <pre>{error.stack}</pre>
        </div>
    );
}

export default function App() {
    const { nextGame, user, player } =
        useLoaderData<LoaderData>() as LoaderData;

    const location = useLocation();
    const rootScreen = location.pathname === "/";

    const showGreeting = !user;
    return (
        <html lang="en" className="bg-neutral-100">
            <head>
                <title>{messages.app.title}</title>
                <Meta />
                <Links />
            </head>
            <body className="h-full">
                <div className="flex flex-col">
                    <main className="flex">
                        <div className="flex-1 ">
                            <Toaster />
                            <div className={"mb-20 md:mb-5"}>
                                <TopNavBar
                                    appMenu={appMenu.app}
                                    user={user ?? undefined}
                                />
                                <GameBanner game={nextGame} />
                                <Greeting
                                    player={player}
                                    showGreeting={showGreeting}
                                />
                                <RootScreen
                                    show={rootScreen}
                                    nextGame={nextGame}
                                    player={player}
                                />
                                <div className={"mt-5 px-4 md:px-10"}>
                                    <Outlet />
                                </div>
                                <Form
                                    method={"post"}
                                    action={routeLinks.application}>
                                    <input
                                        type={"hidden"}
                                        name="nextGameId"
                                        value={nextGame?.id}
                                    />
                                    <input
                                        type={"hidden"}
                                        name="playerId"
                                        value={player?.id}
                                    />
                                    <BottomNavigationBar
                                        admin={user ?? undefined}
                                        game={nextGame}
                                        player={player}
                                    />
                                </Form>
                            </div>
                        </div>
                    </main>
                </div>
                <ScrollRestoration />
                <Scripts />
                <LiveReload />
            </body>
        </html>
    );
}
