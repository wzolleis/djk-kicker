import {MailBuilder} from "~/helpers/mail/mailApiClient";
import {useDateTime} from "~/utils";
import messages from "~/components/i18n/messages";
import {createEncryptedPlayerToken} from "~/utils/token.server";
import mailLinkBuilder from "~/helpers/mail/mailLinkBuilder";
import {Game, Player} from "@prisma/client";
import {MailTemplateType} from "~/config/mailTypes";
import {Mail, Recipient} from "driftmail";

type CreateMailParams = {
    game: Game,
    mailTemplate: MailTemplateType

    allPlayer: Player[]

    host: string
}



export const createDriftMailData = async ({game, mailTemplate, allPlayer, host}: CreateMailParams): Promise<Mail> => {
    const gameId = game.id


    const mailApiClient = new MailBuilder({
        event: {
            date: useDateTime(game.gameTime),
            name: game.name,
            location: messages.commonForm.spielort(game.spielort)
        },
        templateName: mailTemplate
    })

    for (let i = 0; i < allPlayer.length; i++) {
        const player = allPlayer[i]
        const token = await createEncryptedPlayerToken(player.id);
        const invitationLink = mailLinkBuilder.gameInvitationLink({host, gameId, token})

        mailApiClient.addRecipient({
            mailAddress: player.email,
            variables: {
                invitationLink,
                name: player.name,
            }
        })
    }

    const gameMail = mailApiClient.buildMail()
    const mail = new Mail(gameMail.mail.template)
    mail.addVariable(gameMail.variables)
    gameMail.recipients.forEach((recipient) => {
        mail.addRecipient(new Recipient(recipient.mailAddress, recipient.variables))
    })
    return mail
}
