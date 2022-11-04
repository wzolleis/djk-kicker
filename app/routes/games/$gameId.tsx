import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getGameById, getGames } from "~/models/game.server";
import type { Game } from "@prisma/client";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import gameHeader from "~/components/game/gameHeader";
import GameHeader from "~/components/game/gameHeader";
import Players from "~/components/game/Players";
import { Prisma } from "@prisma/client";


export type GameWithFeedback = Prisma.GameGetPayload<{
  include: {
    feedback: {
      include: {
        player: true
      }
    }
  }
}>

type LoaderData = {
  game: GameWithFeedback
}


export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.gameId, "Help");
  const gameId = params.gameId;
  const game: GameWithFeedback | null = await getGameById(gameId);
  return json({ game });
};


export default function Games() {
  const { game } = useLoaderData() as LoaderData;


  // @ts-ignore
  return (
    <div className="px-3 flex flex-col gap-5">
      <GameHeader game={game}></GameHeader>
      <Players game={game}></Players>
    </div>
  );

}