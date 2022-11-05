import GameHeader from "~/components/game/GameHeader";
import type { Prisma } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import invariant from "tiny-invariant";
import { getGameById } from "~/models/game.server";
import { useLoaderData } from "@remix-run/react";
import Players from "~/components/game/Players";


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


const GameIndex = () => {
  const { game } = useLoaderData<LoaderData>();

  return (
    <section className={"flex flex-col gap-3"}>
      {  /* @ts-ignore */}
      <GameHeader game={game}></GameHeader>
      <Players game={game}></Players>
    </section>);
};


export default GameIndex;