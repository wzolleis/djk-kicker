import {GameMail, MailBuilder} from "~/helpers/mail/mailApiClient";
import {useDateTime} from "~/utils";
import messages from "~/components/i18n/messages";
import {createEncryptedPlayerToken} from "~/utils/token.server";
import mailLinkBuilder from "~/helpers/mail/mailLinkBuilder";
import {Game} from "@prisma/client";
import {MailTemplateType} from "~/config/mailTypes";
import {PlayerMailData} from "~/models/player.server";
import {DriftmailClient, Mail, Recipient} from "driftmail";
import {DriftmailGetStatusRequestResponse} from "driftmail/build/GetStatusRequestResponse";

type CreateMailParams = {
    game: Game,
    mailTemplate: MailTemplateType

    playerMailData: PlayerMailData[]

    host: string
}

const client = new DriftmailClient()

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

export const sendGameMail = async ({mail: gameMail}: SendMailParam) => {
    const mail = new Mail(gameMail.mail.template)
    mail.addVariable(gameMail.variables)
    gameMail.recipients.forEach((recipient) => {
        mail.addRecipient(new Recipient(recipient.mailAddress, recipient.variables))
    })

    return await client.send(mail)
}

export type GameMailJob = {
    status: string
    requestId: string
    mailAddress: string
}

export type GameMailStatusResponse = {
    jobs: GameMailJob[]
}

export const getGameMailStatus = async (requestId: string): Promise<GameMailStatusResponse> => {
    const response: DriftmailGetStatusRequestResponse = await client.getStatus(requestId)
    const jobs: GameMailJob[] = response.map(job => {
        return {
            mailAddress: job.mail_address,
            status: job.status,
            requestId: job.request_id
        }
    })

    return {jobs}
}