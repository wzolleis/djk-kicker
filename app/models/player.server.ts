import type { Player } from "@prisma/client";
import { Feedback, Game } from "@prisma/client";
import { prisma } from "~/db.server";
import { getDefaultFeedback, getUniqueFeedbackForGameAndPlayer } from "~/models/feedback.server";
import defaultFeedback from "~/components/player/feedback/DefaultFeedbackComponent";

export type { Player } from "@prisma/client";

export async function getPlayers() {
  return prisma.player.findMany();
}

export async function getPlayerById(id: Player["id"]) {
  if (!id) {
    throw new Error("No player Id provided");
  }
  return await prisma.player.findUnique({ where: { id } });
}

export interface PlayerWithFeedback extends Player {
  feedback: Feedback;
}

export async function getPlayersWithUniqueFeedbackForGame(gameId: Game["id"]): Promise<PlayerWithFeedback[]> {
  const playersWithFeedback: PlayerWithFeedback[] = [];
  const players = await prisma.player.findMany();
  for (const player of players) {
    const feedback = await getUniqueFeedbackForGameAndPlayer(gameId, player.id);
    const playerWithFeedback: PlayerWithFeedback = {
      ...player,
      feedback,
    };
    playersWithFeedback.push(playerWithFeedback);
  }
  return playersWithFeedback;
}

export async function createPlayer(name: string, email: string) {
  return await prisma.player.create({
    data: {
      name,
      email,
    },
  });
}

export async function updatePlayer(id: Player["id"], name: string, email: string) {
  return await prisma.player.update({
    where: {
      id,
    },
    data: {
      name,
      email,
    },
  });
}

export async function deletePlayer(id: Player["id"]) {
  return prisma.player.delete({ where: { id } });
}
