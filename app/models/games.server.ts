import { prisma } from "~/db.server";
import type { Event } from "@prisma/client";
import { json } from "@remix-run/node";

export type Game = Event

export type GameActionData = {
  eventTime: string | null,
  name: string | null,
  link: string | null
}


export const getGames = async (): Promise<Game[]> => {
  return await prisma.event.findMany({
    orderBy: {
      eventTime: "desc"
    }
  });
};

export const createGame = async (game: Pick<Game, "eventTime" | "name" | "link">) => {
  const errors: GameActionData = {
    eventTime: !game.eventTime ? `Zeit muss gesetzt sein` : null,
    name: null,
    link: null
  };

  if (Object.values(errors).some(value => value !== null)) {
    return json<GameActionData>(errors);
  }

  await prisma.event.create({ data: game });
};
