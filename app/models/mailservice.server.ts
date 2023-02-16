import {GameMail} from "~/helpers/mail/mailApiClient";
import {prisma} from "~/db.server";
import {GameMailStatusResponse} from "~/helpers/mail/mailServiceHelper";

export type MailServiceJob =
    {
        "id": string
        "job_id": number,
        "project_id": string
        "request_id": string,
        "mail_address": string,
        "status": string
    }

export type MailServiceRequest = {
    mailData: GameMail,
    gameId: string,
    status: number
    requestType: string

    requestId: string
}

export type MailServiceStatusResponse = {
    jobs: MailServiceJob[]
}

export type MailServiceStatusParam = {
    response: GameMailStatusResponse,
    requestId: string
}

export const createMailServiceRequest = async ({requestId, gameId} : {requestId: string, gameId: string}) => {
    return prisma.mailServiceRequest.create({data: {requestId, gameId}})
}

export const deleteMailServiceRequests = async (gameId: string) => {
    return prisma.mailServiceRequest.deleteMany({where: {gameId}})
}