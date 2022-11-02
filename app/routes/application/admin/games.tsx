import type { Game } from "~/models/games.server";
import { getGames } from "~/models/games.server";
import type { LoaderArgs } from "@remix-run/node";
import { requireUserId } from "~/session.server";
import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import messages from "~/components/i18n/messages";

type LoaderData = {
  games: Awaited<ReturnType<typeof getGames>>
}

export const loader = async ({ request }: LoaderArgs) => {
  await requireUserId(request);

  return json<LoaderData>({
    games: await getGames()
  });
};

type GameListProps = { games: Game[] }
const GameList = ({ games }: GameListProps) => {
  return (
    <div className="mb-2 p-2 bg-gray-300 overflow-auto">
      <ul className="mb-2">
        {games.map((game) => {
            const isActive = true;
            const bgStyle = isActive ? "bg-gray-400 text-white" : "";
            return (
              <li key={game.id} className={"hover:bg-gray-400 hover:text-white " + bgStyle}>
                <Link to={game.id}
                      className={isActive ? "font-bold" : "font-medium"}>
                  <span>{`${messages.gamesform.name}: ${game.name}`}</span>
                </Link>
              </li>
            );
          }
        )}
      </ul>
      <Link to="new"
            className="py-2 hover:bg-gray-100 rounded border-gray-300">
        <i className="fa-solid fa-square-plus" />
        <span className="m-2">{messages.gamesform.new}</span>
      </Link>
    </div>
  );
};


const Games = () => {
  const { games } = useLoaderData<LoaderData>();

  return (
    <main className="flex:col w-full h-full">
      {  /* @ts-ignore */}
      <GameList games={games} />
      <Outlet />
    </main>
  );
};

export default Games;