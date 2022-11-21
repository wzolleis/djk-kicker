import {getGameById} from "~/models/games.server";
import invariant from "tiny-invariant";
import {getPlayerById} from "~/models/player.server";
import messages from "~/components/i18n/messages";
import dateUtils from "~/dateUtils";
import mailSender from "~/helpers/mail/mailsender";

const sendGameInvitation = async ({gameId, host, playerIds}: {gameId: string, host: string, playerIds: string[]}) => {
    const game = await getGameById(gameId)
    invariant(game !== null)

    const isRemote = (host.startsWith("djk-kicker.netlify.app") || host.startsWith("kicker.timzolleis.com"))
    const protocol = isRemote ? "https" :"http"

    const invitationLink = `${protocol}://${host}/application/games/${gameId}?token=${game.token}`
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
        }, )
        const mailTo = player.email


        await mailSender.sendMail({mailTo, subject, body})
    }
}

export default {
    sendGameInvitation
}