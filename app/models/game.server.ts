import type { Game } from "@prisma/client";
import { prisma } from "~/db.server";

export type { Game } from "@prisma/client";

export async function getGameById(id: Game["id"]) {
  return prisma.game.findUnique({
    where: { id }, include: {
      feedback: {
        include: {
          player: true
        }
      }
    }
  });
}

export async function getGames() {
  return prisma.game.findMany();
}






