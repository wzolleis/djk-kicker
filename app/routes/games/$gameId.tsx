import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getGameById, getGames } from "~/models/game.server";
import type { Game } from "@prisma/client";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { useGames } from "~/utils";
import gameHeader from "~/components/game/gameHeader";
import GameHeader from "~/components/game/gameHeader";


type LoaderData = {
  game: Game
}


export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.gameId, "Help");
  const gameId = params.gameId;
  const game = await getGameById(gameId);
  // @ts-ignore
  return json<LoaderData>({ game });
};


export default function Games() {
  const { game } = useLoaderData() as LoaderData;

  return (
    <div className="px-2">
      <GameHeader game={game} ></GameHeader>
    </div>
  );

}