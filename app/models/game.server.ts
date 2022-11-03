import type { Game } from "@prisma/client";
import { prisma } from "~/db.server";

export type { Game } from "@prisma/client";

export async function getGameById(id: Game["id"]) {
  return prisma.game.findUnique({ where: { id } });
}

export async function getGames() {
  return prisma.game.findMany();
}






