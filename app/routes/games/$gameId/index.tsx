import GameHeader from "~/components/game/gameHeader";
import { Prisma } from "@prisma/client";
import { json, LoaderFunction } from "@remix-run/node";
import invariant from "tiny-invariant";
import { getGameById } from "~/models/game.server";
import { useLoaderData, useNavigate } from "@remix-run/react";
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
  const { game } = useLoaderData() as LoaderData;

  return (
    <section>
      <GameHeader game={game}></GameHeader>
      <Players game={game}></Players>
    </section>);
};


export default GameIndex;