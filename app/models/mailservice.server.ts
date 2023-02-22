import {prisma} from "~/db.server";
import {MailServiceRequest} from "@prisma/client";

export const createMailServiceRequest = async ({requestId, gameId, requestType, requestPayload}: { requestId: string, gameId: string, requestType: string, requestPayload: string }): Promise<MailServiceRequest> => {
    return prisma.mailServiceRequest.create({data: {requestId, gameId, requestType, requestPayload}})
}

export const deleteMailServiceRequests = async (gameId: string) => {
    return prisma.mailServiceRequest.deleteMany({where: {gameId}})
}

export const findMailRequestByGameId = async ({gameId}: { gameId: string }): Promise<MailServiceRequest[]> => prisma.mailServiceRequest.findMany({where: {gameId}})