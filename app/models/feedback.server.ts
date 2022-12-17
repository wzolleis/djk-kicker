import type { Feedback, Game, Player } from "@prisma/client";
import { prisma } from "~/db.server";
import { Nullable } from "vitest";
import { configuration } from "~/config";
import { createPlayerToken } from "~/utils/token.server";
import playerId from "~/routes/application/games/$gameId/player/$playerId";

export async function getFeedbackForGame(gameId: Feedback["gameId"]) {
  return await prisma.feedback.findMany({ where: { gameId } });
}

export async function getUniqueFeedbackForGameAndPlayer(gameId: Game["id"], playerId: Player["id"]): Promise<Feedback> {
  let feedback = await prisma.feedback.findUnique({
    where: {
      playerId_gameId: {
        playerId: playerId,
        gameId: gameId,
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
        gameId: gameId,
      },
    },
  });
}

export async function updateFeedback(playerId: Player["id"], gameId: Game["id"], status: number, note: Nullable<string>) {
  return await prisma.feedback.updateMany({
    where: {
      AND: [
        {
          gameId: gameId,
        },
        { playerId: playerId },
      ],
    },
    data: {
      status: status,
      note: note,
    },
  });
}

export async function createFeedback(playerId: Player["id"], gameId: Game["id"], status: number, note: Nullable<string>, invitationToken: string) {
  return await prisma.feedback.create({
    data: {
      playerId: playerId,
      gameId: gameId,
      status: status,
      note: note,
      invitationToken: invitationToken,
    },
  });
}

export async function createDefaultFeedback(gameId: Game["id"], playerId: Player["id"], invitationToken: string) {
  return await prisma.feedback.create({
    data: {
      gameId: gameId,
      playerId: playerId,
      status: configuration.status.unknown,
      invitationToken: invitationToken,
    },
  });
}
