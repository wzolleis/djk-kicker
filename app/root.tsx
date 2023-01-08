import type {LinksFunction, LoaderArgs, LoaderFunction, MetaFunction} from "@remix-run/node";
import {json} from "@remix-run/node";
import {Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration} from "@remix-run/react";

import tailwindStylesheetUrl from "./styles/tailwind.css";
import {getUser} from "./session.server";
import {getGameById, getMostRecentGame} from "~/models/games.server";
import {authenticatePlayer} from "~/utils/session.server";
import {GameWithFeedback, UserAuthentication} from "~/config/applicationTypes";
import {DefaultFeedback, User} from "@prisma/client";
import {getDefaultFeedback} from "~/models/feedback.server";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: tailwindStylesheetUrl },
    { rel: "stylesheet", href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css" }
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

export const loader: LoaderFunction = async ({request}: LoaderArgs) =>  {
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

export default function App() {
  return (
    <html lang="en" className="h-full bg-neutral-100">
    <head>
      <title>DJK Kicker</title>
      <Meta />
      <Links />
    </head>
    <body className="h-full">
    <Outlet />
    <ScrollRestoration />
    <Scripts />
    <LiveReload />
    </body>
    </html>
  );
}
