import type { Feedback, Game, Player } from "@prisma/client";
import { DefaultFeedback } from "@prisma/client";
import { prisma } from "~/db.server";
import { Nullable } from "vitest";
import { configuration } from "~/config";
import { createPlayerToken } from "~/utils/token.server";

export async function getFeedbackForGame(gameId: Feedback["gameId"]) {
  return await prisma.feedback.findMany({ where: { gameId } });
}

export async function getUniqueFeedbackForGameAndPlayer(gameId: Game["id"], playerId: Player["id"]): Promise<Feedback> {
  let feedback = await prisma.feedback.findUnique({
    where: {
      playerId_gameId: {
        playerId,
        gameId,
      },
    },
  });
  if (!feedback) {
    const playerToken = await createPlayerToken(gameId, playerId);
    feedback = await createDefaultFeedback(gameId, playerId, playerToken);
  }
  return feedback;
}

export async function createFeedbackForPlayers(gameId: string) {
  const players = await prisma.player.findMany();
  for (const player of players) {
    const playerToken = await createPlayerToken(gameId, player.id);
    await createDefaultFeedback(gameId, player.id, playerToken);
  }
}

export async function getPlayerFeedbackForGame(id: Player["id"], gameId: Feedback["gameId"]) {
  return await prisma.player.findUnique({
    where: {
      id,
    },
    include: {
      feedback: {
        where: {
          gameId,
        },
      },
    },
  });
}

export async function findFeedbackWithPlayerIdAndGameId(id: Player["id"], gameId: Game["id"]) {
  return await prisma.feedback.findUnique({
    where: {
      playerId_gameId: {
        playerId: id,
        gameId,
      },
    },
  });
}

export async function updateFeedback(playerId: Player["id"], gameId: Game["id"], status: number, playerCount: number, note: Nullable<string>) {
  return await prisma.feedback.update({
    where: {
      playerId_gameId: {
        playerId,
        gameId,
      },
    },
    data: {
      status,
      playerCount,
      note,
    },
  });
}

export async function createFeedback(playerId: Player["id"], gameId: Game["id"], status: number, note: Nullable<string>, invitationToken: string) {
  return await prisma.feedback.create({
    data: {
      playerId,
      gameId,
      status,
      note,
      invitationToken,
    },
  });
}

export async function createDefaultFeedback(gameId: Game["id"], playerId: Player["id"], invitationToken: string) {
  return await prisma.feedback.create({
    data: {
      gameId,
      playerId,
      status: configuration.status.unknown,
      invitationToken,
    },
  });
}

export async function createNewDefaultFeedback(playerId: Player["id"]) {
  return await prisma.defaultFeedback.create({
    data: {
      playerId,
    },
  });
}

export async function getDefaultFeedback(playerId: Player["id"]) {
  let defaultFeedback = await prisma.defaultFeedback.findUnique({
    where: {
      playerId,
    },
  });
  if (!defaultFeedback) {
    defaultFeedback = await createNewDefaultFeedback(playerId);
  }
  return defaultFeedback;
}

export async function updateDefaultFeedback(playerId: Player["id"], status: number, playerCount: number, note?: string): Promise<DefaultFeedback> {
  return await prisma.defaultFeedback.update({
    where: {
      playerId,
    },
    data: {
      status,
      note,
      playerCount,
    },
  });
}
