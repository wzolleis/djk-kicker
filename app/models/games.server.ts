import { prisma } from "~/db.server";
import { json } from "@remix-run/node";
import type { Game } from "@prisma/client";

export type GameActionData = {
  gameTime: string | null,
  name: string | null,
}


export const getGames = async (): Promise<Game[]> => {
  return await prisma.game.findMany({
    orderBy: {
      gameTime: "desc"
    }
  });
};

export const createGame = async (game: Pick<Game, "gameTime" | "name">) => {
  const errors: GameActionData = {
    gameTime: !game.gameTime ? `Zeit muss gesetzt sein` : null,
    name: !game.gameTime ? `Name muss gesetzt sein` : null
  };

  if (Object.values(errors).some(value => value !== null)) {
    return json<GameActionData>(errors);
  }

  await prisma.game.create({ data: game });
};
