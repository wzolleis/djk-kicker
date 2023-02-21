import {prisma} from "~/db.server";
import {MailServiceRequest} from "@prisma/client";

export const createMailServiceRequest = async ({requestId, gameId, requestType}: { requestId: string, gameId: string, requestType: string }): Promise<MailServiceRequest> => {
    return prisma.mailServiceRequest.create({data: {requestId, gameId, requestType}})
}

export const deleteMailServiceRequests = async (gameId: string) => {
    return prisma.mailServiceRequest.deleteMany({where: {gameId}})
}

export const findMailRequestByGameId = async ({gameId}: { gameId: string }): Promise<MailServiceRequest[]> => prisma.mailServiceRequest.findMany({where: {gameId}})