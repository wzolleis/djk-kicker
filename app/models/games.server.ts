import type { Game } from "@prisma/client";
import { prisma } from "~/db.server";
import { getNextGameDay } from "~/utils";

export type { Game } from "@prisma/client";

export async function getGameById(id: Game["id"]) {
  return prisma.game.findUnique({
    where: { id },
    include: {
      feedback: {
        include: {
          player: true,
        },
      },
    },
  });
}

export async function findGameById(id: Game["id"]) {
  return await prisma.game.findUnique({
    where: { id },
  });
}

export async function getGames() {
  return prisma.game.findMany({
    orderBy: {
      gameTime: "desc",
    },
  });
}

export async function getMostRecentGame(): Promise<Game | null> {
  const nextGameDate = getNextGameDay();
  const nextGame = await prisma.game.findFirst({
    where: {
      gameTime: {
        gte: nextGameDate.toJSDate(),
      },
    },
    orderBy: {
      gameTime: "asc",
    },
  });

  if (!nextGame) {
    return await getLastGame();
  }

  return nextGame;
}

export async function getLastGame(): Promise<Game | null> {
  return await prisma.game.findFirst({
    orderBy: {
      gameTime: "asc",
    },
  });
}
