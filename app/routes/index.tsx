import {Link} from "@remix-run/react";

import {useOptionalUser} from "~/utils";
import messages from "~/components/i18n/messages";
import {LoaderFunction, redirect} from "@remix-run/node";

export const loader: LoaderFunction = () => {
  return redirect("/application/games")
}


export default function Index() {
  const user = useOptionalUser();
  return (
    <main className="relative min-h-screen bg-white sm:flex sm:items-center sm:justify-center">
      <div className="relative sm:pb-16 sm:pt-8">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="relative shadow-xl sm:overflow-hidden sm:rounded-2xl">
            <div className="absolute inset-0">
              <img
                className="h-full w-full object-cover"
                src="/img/welcome.jpg"
                alt={messages.app.welcome}
              />
              <div className="absolute inset-0 bg-[color:rgba(254,204,27,0.5)] mix-blend-multiply"/>
            </div>
            <div
              className="relative px-4 pt-16 pb-8 sm:px-6 sm:pt-24 sm:pb-14 lg:px-8 lg:pb-20 lg:pt-32">
              <h1 className="text-center text-6xl font-extrabold tracking-tight sm:text-8xl lg:text-9xl">
                <span className="block uppercase text-yellow-500 drop-shadow-md">
                  {messages.app.title}
                </span>
              </h1>
              <div className="mx-auto mt-10 max-w-sm sm:flex sm:max-w-none sm:justify-center">
                {user ? (
                  <Link
                    to="/application"
                    className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-yellow-700 shadow-sm hover:bg-yellow-50 sm:px-8"
                  >
                    Übersicht für {user.email}
                  </Link>
                ) : (
                  <div
                    className="space-y-4 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5 sm:space-y-0">
                    <Link
                      to="/join"
                      className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-yellow-700 shadow-sm hover:bg-yellow-50 sm:px-8"
                    >
                      Account anlegen
                    </Link>
                    <Link
                      to="/login"
                      className="flex items-center justify-center rounded-md bg-yellow-500 px-4 py-3 font-medium text-white hover:bg-yellow-600"
                    >
                      Anmelden
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-16 max-w-7xl text-center">
          <Link
            to="/references"
            className="text-xl text-blue-600 underline"
          >
            Referenzen
          </Link>
          <div className="mx-auto mt-10 max-w-sm sm:flex sm:max-w-none sm:justify-end">
            <a href="https://freepik.com/">Bilder von Freepik</a>
          </div>
        </div>
      </div>
    </main>
  );
}
