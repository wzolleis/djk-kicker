import type { Feedback } from "@prisma/client";
import type { Game, Player } from "@prisma/client";
import { prisma } from "~/db.server";
import { Nullable } from "vitest";



export async function getFeedbackForGame(gameId: Feedback["gameId"]) {
  return await prisma.feedback.findMany({ where: { gameId } });
}

export async function getPlayerFeedbackForGame(id: Player["id"], gameId: Feedback["gameId"]) {
  return await prisma.player.findUnique({
    where: {
      id
    },
    include: {
      feedback: {
        where: {
          gameId
        }
      }
    }
  });
}

export async function updateFeedback(playerId: Player["id"], gameId: Game["id"], status: Nullable<boolean>, note: Nullable<string>) {
  return await prisma.feedback.updateMany({
    where: {
      AND: [{
        gameId: gameId
      },
        { playerId: playerId }]
    },
    data: {
      status: status,
      note: note
    }
  });
}


export async function createDefaultFeedback(gameId: Game["id"]) {
  const players = await prisma.player.findMany();
  for (const player of players) {
    const feedback = await prisma.feedback.create({
      data: {
        gameId: gameId,
        playerId: player.id,
        status: null
      }
    });

  }
}