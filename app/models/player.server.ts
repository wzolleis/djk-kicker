import type { Player } from "@prisma/client";
import { prisma } from "~/db.server";

export type { Player } from "@prisma/client";

export async function getPlayers() {
  return prisma.player.findMany();
}

export async function getPlayer(id: Player["id"]) {
  return prisma.player.findUnique({ where: { id } });
}


export async function createPlayer(name: string, email: string) {
  return prisma.player.create({
    data: {
      name,
      email
    }
  });
}
