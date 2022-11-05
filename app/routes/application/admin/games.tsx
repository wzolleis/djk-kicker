import { readGames } from "~/models/admin.games.server";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { requireUserId } from "~/session.server";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import messages from "~/components/i18n/messages";
import type { Game } from "@prisma/client";
import dateUtils from "~/dateUtils";

type LoaderData = {
  games: Awaited<ReturnType<typeof readGames>>
}

export const loader = async ({ request }: LoaderArgs) => {
  await requireUserId(request);

  return json<LoaderData>({
    games: await readGames()
  });
};

const isOldGame = (game: Game): boolean => !!game.gameTime && (new Date() > new Date(game.gameTime));

const GameView = ({ game }: { game: Game }) => {
  let oldGame = isOldGame(game);
  const gameTime = dateUtils.format(new Date(game.gameTime));
  return (
    <li>
      <Link to={game.id}
            className={`font-medium block px-2 py-1 font-semibold rounded hover:bg-gray-800 hover:text-yellow-300 ${oldGame ? "text-gray-100" : ""}`}
      >
        <div className="flex align-center">
          <i className="fa-solid fa-futbol" />
          <span className="flex-1 ml-2">{`${game.name} - ${gameTime}`}</span>
        </div>
      </Link>
    </li>

  );
};

type GameListProps = { games: Game[] }
const GameList = ({ games }: GameListProps) => {
  return (
    <div className="mb-2 p-2 bg-gray-300 overflow-auto">
      <ul className="mb-2">
        {games.map((game) => <GameView key={game.id} game={game} />)}
      </ul>
      <Link to="new"
            className="py-2 hover:bg-gray-100 rounded border-gray-300">
        <i className="fa-solid fa-square-plus" />
        <span className="m-2">{messages.adminGamesForm.new}</span>
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