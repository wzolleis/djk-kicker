import { prisma } from "~/db.server";
import type { Event } from "@prisma/client";

export type Game = Event

export const getGames = async (): Promise<Game[]> => {
  return await prisma.event.findMany();
};