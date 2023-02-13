import {GameMail, MailBuilder} from "~/helpers/mail/mailApiClient";
import {useDateTime} from "~/utils";
import messages from "~/components/i18n/messages";
import {createEncryptedPlayerToken} from "~/utils/token.server";
import mailLinkBuilder from "~/helpers/mail/mailLinkBuilder";
import {Game} from "@prisma/client";
import {MailTemplateType} from "~/config/mailTypes";
import {PlayerMailData} from "~/models/player.server";
import axios, {AxiosResponse} from "axios";

type CreateMailParams = {
    game: Game,
    mailTemplate: MailTemplateType

    playerMailData: PlayerMailData[]

    host: string
}

const axiosInstance = axios.create({
    baseURL: process.env.MAILSERVICE_ENDPOINT,
    timeout: 60000,
    headers: {
        'X-API-KEY': process.env.MAILSERVICE_API_KEY,
        'Content-Type': 'application/json'
    }
});

export const createMailData = async ({game, mailTemplate, playerMailData, host}: CreateMailParams): Promise<GameMail> => {
    const gameId = game.id


    const mailApiClient = new MailBuilder({
        event: {
            date: useDateTime(game.gameTime),
            name: game.name,
            location: messages.commonForm.spielort(game.spielort)
        },
        templateName: mailTemplate
    })

    for (let i = 0; i < playerMailData.length; i++) {
        const data = playerMailData[i]
        const token = await createEncryptedPlayerToken(data.id, gameId);
        const invitationLink = mailLinkBuilder.gameInvitationLink({host, gameId, token})

        mailApiClient.addRecipient({
            mailAddress: data.email,
            variables: {
                invitationLink,
                name: data.name,
            }
        })
    }

    return mailApiClient.buildMail()
}

export type SendMailParam = {
    mail: GameMail
}

export type SendMailResponse = {
    request_id: string
}

export const sendGameMail = async ({mail}: SendMailParam) => {
    const response: AxiosResponse<SendMailResponse> = await axiosInstance.post('/send', mail)
    console.log('mail sending response', response.data)
    return response.data
}

export type GameMailJob = {
    id: string
    job_id: number,
    project_id: string,
    request_id: string,
    mail_address: string,
    status: string
}


export type GameMailStatusResponse = {
    "jobs": GameMailJob[]
    status: number
    statusText?: string | undefined
    error?: string | undefined
}

export const getGameMailStatus = async (requestId: string): Promise<GameMailStatusResponse> => {
    const response: AxiosResponse<GameMailStatusResponse> = await axiosInstance.get(`status/${requestId}`)
    console.log("send game mail status = ", `${requestId} - ${response.status} - ${response.statusText}` )
    return {
        jobs: response.data.jobs,
        status: response.status,
        statusText: response.statusText,
        error: response.data.error
    }
}