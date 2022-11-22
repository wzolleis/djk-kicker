import PageHeader from "~/components/common/PageHeader";
import MainPageContent from "~/components/common/MainPageContent";
import Games from "~/components/game/Games";
import Selector from "~/components/common/Selector";
import type {LoaderFunction} from "@remix-run/node";
import {json} from "@remix-run/node";
import {getGames, getMostRecentGame} from "~/models/games.server";
import {useLoaderData, useSearchParams} from "@remix-run/react";
import messages from "~/components/i18n/messages";

type LoaderData = {
    games: Awaited<ReturnType<typeof getGames>>;
    filter: string;
};

export const loader: LoaderFunction = async ({request}) => {
    let games;
    const url = new URL(request.url);
    const filter = url.searchParams.get("filter")
        ? url.searchParams.get("filter")!
        : "current";

    if (filter === messages.game.filters.values.current) {
        games = await getMostRecentGame();
    } else games = await getGames();


    return json<LoaderData>({games, filter});
};

function isFilterActive(filter: string, id: string) {
    return filter === id;
}

const GameIndex = () => {
    const {games, filter} = useLoaderData() as unknown as LoaderData;
    const [searchParams, setSearchParams] = useSearchParams();

    const filterAll = messages.game.filters.values.all;
    const filterCurrent = messages.game.filters.values.current;
    const setFilter = (filter: string) => {
        setSearchParams({filter: filter});
    };

    return (
        <main className={"flex flex-col gap-3"}>
            <header>
                <PageHeader title={"Spiele"}/>
            </header>

            <Selector>
                <button
                    onClick={() => setFilter(filterAll)}
                    className={`flex cursor-pointer items-center rounded-xl py-3 px-5 font-poppins-regular text-label-medium ${
                        isFilterActive(filter, filterAll)
                            ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/40"
                            : "text-gray-600 shadow-lg shadow-inner shadow-slate-800/50"
                    }`}
                >
                    {messages.game.filters.all}
                </button>
                <button
                    onClick={() => setFilter(filterCurrent)}
                    className={`flex cursor-pointer items-center rounded-xl py-3 px-5 font-poppins-regular text-label-medium ${
                        isFilterActive(filter, filterCurrent)
                            ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/40"
                            : "text-gray-600 shadow-lg shadow-inner shadow-slate-800/50"
                    }`}
                >
                    {messages.game.filters.current}
                </button>
            </Selector>

            <MainPageContent>
                <Games games={games}/>
            </MainPageContent>
        </main>
    );
};

export default GameIndex;
