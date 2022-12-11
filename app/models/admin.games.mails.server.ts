import {getGameById} from "~/models/games.server";
import invariant from "tiny-invariant";
import {getPlayerById} from "~/models/player.server";
import messages from "~/components/i18n/messages";
import dateUtils from "~/dateUtils";
import mailSender from "~/helpers/mail/mailsender";
import mailLinkBuilder from "~/helpers/mail/mailLinkBuilder";
import {createMail} from "~/models/mails.server";
import {createGameAction, updateGameAction} from "~/models/gameActions.server";
import {DateTime} from "luxon";
import {mailContent} from "~/components/i18n/mailcontent";

const sendGameInvitation = async ({gameId, host, playerIds}: { gameId: string, host: string, playerIds: string[] }) => {
    const game = await getGameById(gameId)
    invariant(game !== null)

    const invitationLink = mailLinkBuilder.gameInvitationLink({host, gameId, token: game.token})

    const action = await createGameAction({
        gameId,
        actionType: 'GAME_INVITATION'
    })

    for (let i = 0; i < playerIds.length; i++) {
        const player = await getPlayerById(playerIds[i])
        invariant(player !== null)
        const gameTime = dateUtils.dateTimeToFormat({value: DateTime.fromJSDate(new Date(game.gameTime))})
        const subject = mailContent.invitationMail.mailSubject(gameTime)
        const body = mailContent.invitationMail.mailBody({
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
                actionId: action.id,
                status: 200,
                statusTxt: `${subject}, ${mailTo}`,
                mailType: 'GAME_INVITATION'
            })
            await updateGameAction({
                ...action,
                status: 200,
            })
        } catch(error) {
            await createMail({
                playerId: player.id,
                actionId: action.id,
                status: 500,
                statusTxt: `ERROR: ${subject}, ${mailTo}, ${JSON.stringify(error)}`,
                mailType: 'GAME_INVITATION'
            })

            await updateGameAction({
                ...action,
                status: 500,
                statusTxt: `ERROR: ${JSON.stringify(error)}`
            })
        }
    }
}

const sendGameZusage = async ({gameId, playerIds}: { gameId: string, playerIds: string[]}) => {
    const game = await getGameById(gameId)
    invariant(game !== null)

    const action = await createGameAction({
        gameId,
        actionType: 'GAME_ZUSAGE'
    })

    for (let i = 0; i < playerIds.length; i++) {
        const player = await getPlayerById(playerIds[i])
        invariant(player !== null)

        const gameTime = dateUtils.dateTimeToFormat({value: DateTime.fromJSDate(new Date(game.gameTime))})
        const subject = mailContent.zusageMail.mailSubject(gameTime)
        const body = mailContent.zusageMail.mailBody({
            datum: gameTime,
            spielOrt: messages.adminGameInvitationForm.spielort(game.spielort),
            playerName: player.name
        },)
        const mailTo = player.email
        try {
            await mailSender.sendMail({mailTo, subject, body})
            await createMail({
                playerId: player.id,
                actionId: action.id,
                status: 200,
                statusTxt: `${subject}, ${mailTo}`,
                mailType: 'GAME_ZUSAGE'
            })
            await updateGameAction({
                ...action,
                status: 200,
            })
        } catch(error) {
            await createMail({
                playerId: player.id,
                actionId: action.id,
                status: 500,
                statusTxt: `ERROR: ${subject}, ${mailTo}, ${JSON.stringify(error)}`,
                mailType: 'GAME_ZUSAGE'
            })

            await updateGameAction({
                ...action,
                status: 500,
                statusTxt: `ERROR: ${JSON.stringify(error)}`
            })
        }
    }
}

const sendGameAbsage = async ({gameId, playerIds}: { gameId: string, playerIds: string[]}) => {
    const game = await getGameById(gameId)
    invariant(game !== null)

    const action = await createGameAction({
        gameId,
        actionType: 'GAME_ABSAGE'
    })

    for (let i = 0; i < playerIds.length; i++) {
        const player = await getPlayerById(playerIds[i])
        invariant(player !== null)

        const gameTime = dateUtils.dateTimeToFormat({value: DateTime.fromJSDate(new Date(game.gameTime))})
        const subject = mailContent.absageMail.mailSubject(gameTime)
        const body = mailContent.absageMail.mailBody({
            datum: gameTime,
            playerName: player.name
        },)
        const mailTo = player.email
        try {
            await mailSender.sendMail({mailTo, subject, body})
            await createMail({
                playerId: player.id,
                actionId: action.id,
                status: 200,
                statusTxt: `${subject}, ${mailTo}`,
                mailType: 'GAME_ABSAGE'
            })
            await updateGameAction({
                ...action,
                status: 200,
            })
        } catch(error) {
            await createMail({
                playerId: player.id,
                actionId: action.id,
                status: 500,
                statusTxt: `ERROR: ${subject}, ${mailTo}, ${JSON.stringify(error)}`,
                mailType: 'GAME_ABSAGE'
            })

            await updateGameAction({
                ...action,
                status: 500,
                statusTxt: `ERROR: ${JSON.stringify(error)}`
            })
        }
    }
}

export default {
    sendGameInvitation,
    sendGameZusage,
    sendGameAbsage
}