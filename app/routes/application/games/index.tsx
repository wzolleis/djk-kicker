import PageHeader from "~/components/common/PageHeader";
import MainPageContent from "~/components/common/MainPageContent";
import Games from "~/components/game/Games";
import Selector from "~/components/common/Selector";
import type {LoaderFunction} from "@remix-run/node";
import {json} from "@remix-run/node";
import {getGames, getMostRecentGame} from "~/models/games.server";
import {useLoaderData, useSearchParams} from "@remix-run/react";
import messages from "~/components/i18n/messages";

import {FilterTranslations, FilterTranslationsKey, FilterValues} from "~/config/filters";


type LoaderData = {
    games: Awaited<ReturnType<typeof getGames>>;
    filter: string;
};


export const loader: LoaderFunction = async ({request}) => {
    const url = new URL(request.url);
    const [allGames, recentGame] = await Promise.all([getGames(), getMostRecentGame()])


    if (url.searchParams.get("filter") === messages.game.filters.values.current && recentGame.length > 0) {
        const filter = url.searchParams.get("filter")!;
        const games = recentGame;
        return json<LoaderData>({games, filter});
    } else {
        const games = allGames;
        const filter = messages.game.filters.values.all;
        return json<LoaderData>({games, filter})
    }

};

function isFilterActive(filter: string, id: string) {
    return filter === id;
}


const GameIndex = () => {
    const {games, filter} = useLoaderData() as unknown as LoaderData;
    const [searchParams, setSearchParams] = useSearchParams();

    const filterAll: string = FilterValues.all
    const filterCurrent: string = FilterValues.current
    const setFilter = (filter: string) => {
        setSearchParams({filter: filter});
    };

    return (
        <main className={"flex flex-col gap-3"}>
            <header>
                <PageHeader title={FilterTranslations[filter as FilterTranslationsKey]}/>
            </header>

            <Selector>
                <button
                    onClick={() => setFilter(filterAll)}
                    className={`flex cursor-pointer items-center rounded-xl py-3 px-5 font-poppins-regular text-label-medium ${
                        isFilterActive(filter, filterAll)
                            ? "bg-black text-white"
                            : "text-gray-600 ring ring-1 ring-gray-500"
                    }`}
                >
                    {FilterTranslations.all}
                </button>
                <button
                    onClick={() => setFilter(filterCurrent)}
                    className={`flex cursor-pointer items-center rounded-xl py-3 px-5 font-poppins-regular text-label-medium ${
                        isFilterActive(filter, filterCurrent)
                            ? "bg-black text-white"
                            : "text-gray-600 ring ring-1 ring-gray-500"
                    }`}
                >
                    {FilterTranslations.current}
                </button>
            </Selector>

            <MainPageContent>
                <Games games={games}/>
            </MainPageContent>
        </main>
    );
};

export default GameIndex;
