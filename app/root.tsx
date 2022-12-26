import type {LinksFunction, LoaderArgs, MetaFunction} from "@remix-run/node";
import {json} from "@remix-run/node";
import {Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration} from "@remix-run/react";

import tailwindStylesheetUrl from "./styles/tailwind.css";
import {getUser} from "./session.server";

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

export async function loader({request}: LoaderArgs) {
  return json({
    user: await getUser(request),
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
