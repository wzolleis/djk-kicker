import {GameMail} from "~/helpers/mail/mailApiClient";
import {prisma} from "~/db.server";
import {GameMailJob, GameMailStatusResponse} from "~/helpers/mail/mailServiceHelper";
import {getPlayerByMail} from "~/models/player.server";

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

export const insertMailServiceRequest = async (request: MailServiceRequest) => {
    return await prisma.mailServiceRequest.create({
        data: {
            requestId: request.requestId,
            gameId: request.gameId,
            status: request.status,
            requestBody: JSON.stringify(request.mailData).substring(0, 1999),
            requestType: request.requestType
        }
    })
}

export type MailServiceStatusParam = {
    response: GameMailStatusResponse,
    requestId: string
}
export const upsertMailServiceStatus = async ({response, requestId}: MailServiceStatusParam) => {
    const dbResponses  = []
    for (let i = 0; i < response.jobs.length; i++) {
        const job: GameMailJob = response.jobs[i]
        const player = await getPlayerByMail(job.mail_address) // normalerweise gibt es jede Mail-Adresse nur 1x. Im Test ignorieren wir das einach

        if (!!player) {
            dbResponses.push(prisma.mailServiceStatus.upsert({
                where: {
                    jobId_playerId: {
                        jobId: job.job_id,
                        playerId: player.id
                    }
                },
                update: {
                    jobStatus: job.status,
                },
                create: {
                    jobStatus: job.status,
                    jobId: job.job_id,
                    requestId: requestId,
                    mailAddress: job.mail_address,
                    playerId: player.id
                }
            }))
        }

    }

    return await Promise.all(dbResponses)
}
