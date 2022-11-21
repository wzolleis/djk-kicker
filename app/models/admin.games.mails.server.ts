import {getGameById} from "~/models/games.server";
import invariant from "tiny-invariant";
import {getPlayerById} from "~/models/player.server";
import messages from "~/components/i18n/messages";
import dateUtils from "~/dateUtils";
import mailSender from "~/helpers/mail/mailsender";
import mailLinkBuilder from "~/helpers/mail/mailLinkBuilder";
import {createMail} from "~/models/mails.server";
import {mailTypes} from "~/helpers/constants/mailTypes";

const sendGameInvitation = async ({gameId, host, playerIds}: { gameId: string, host: string, playerIds: string[] }) => {
    const game = await getGameById(gameId)
    invariant(game !== null)

    const invitationLink = mailLinkBuilder.gameInvitationLink({host, gameId, token: game.token})
    for (let i = 0; i < playerIds.length; i++) {
        const player = await getPlayerById(playerIds[i])
        invariant(player !== null)

        const gameTime = dateUtils.format(game.gameTime)
        const subject = messages.mailContent.invitationMail.mailSubject(gameTime)
        const body = messages.mailContent.invitationMail.mailBody({
            datum: gameTime,
            einladungsLink: invitationLink,
            spielOrt: messages.adminGameInvitationForm.spielort(game.spielort),
            playerName: player.name
        },)
        const mailTo = player.email
        try {
            await mailSender.sendMail({mailTo, subject, body})
            await createMail({
                playerId: player.id,
                gameId,
                status: 200,
                statusTxt: `SUCCESS: ${subject}, ${mailTo}`,
                mailType: mailTypes.game.invitation
            })
        } catch(error) {
            await createMail({
                playerId: player.id,
                gameId,
                status: 500,
                statusTxt: `ERROR: ${subject}, ${mailTo}, ${JSON.stringify(error)}`,
                mailType: mailTypes.game.invitation
            })
        }
    }
}

export default {
    sendGameInvitation
}