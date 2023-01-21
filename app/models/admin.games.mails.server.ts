import {getGameById} from "~/models/games.server";
import invariant from "tiny-invariant";
import {getPlayerById} from "~/models/player.server";
import messages from "~/components/i18n/messages";
import dateUtils from "~/dateUtils";
import mailSender from "~/helpers/mail/mailsender";
import mailLinkBuilder from "~/helpers/mail/mailLinkBuilder";
import {createMail, MailData, updateMailStatus} from "~/models/mails.server";
import {createGameAction, updateGameAction,} from "~/models/gameActions.server";
import {DateTime} from "luxon";
import {mailContent} from "~/components/i18n/mailcontent";
import {createEncryptedPlayerToken} from "~/utils/token.server";
import {GameAction} from "@prisma/client";
import {SendMailResponse} from "~/config/mailTypes";

type GameInvitationData = {
    gameId: string;
    host: string;
    playerIds: string[];
}

const sendGameInvitation = async ({
                                      gameId,
                                      host,
                                      playerIds,
                                  }: GameInvitationData) => {
    const game = await getGameById(gameId);
    invariant(game !== null);
    const action = await createGameAction({
        gameId,
        actionType: "GAME_INVITATION",
    });

    for (let i = 0; i < playerIds.length; i++) {
        const player = await getPlayerById(playerIds[i]);
        const invitationLink = mailLinkBuilder.gameInvitationLink({
            host,
            gameId,
            token: await createEncryptedPlayerToken(playerIds[i], gameId),
        });
        invariant(player !== null);
        const gameTime = dateUtils.dateTimeToFormat({
            value: DateTime.fromJSDate(new Date(game.gameTime)),
        });
        const subject = mailContent.invitationMail.mailSubject(gameTime);
        const body = mailContent.invitationMail.mailBody({
            datum: gameTime,
            einladungsLink: invitationLink,
            spielOrt: messages.adminGameInvitationForm.spielort(game.spielort),
            playerName: player.name,
        });
        const mailTo = player.email;
        const mailData: MailData = {
            playerId: player.id,
            playerName: player.name,
            actionId: action.id,
            status: 200,
            gameId: game.id,
            statusTxt: `${subject}, ${mailTo}`,
            mailType: "GAME_INVITATION",
        }

        doSendMail(mailTo, subject, body, mailData, action)
    }
};

async function doSendMail(mailTo: string, subject: string, body: string, mailData: MailData, action: GameAction) {
    const mail = await createMail({
        ...mailData,
        status: 0
    })

    try {
        mailSender.sendMail({mailTo, subject, body})
            .then((value: SendMailResponse) => updateMailStatus(mail.id, value.status, value.statusTxt))
            .then(() => updateGameAction({...action, status: 200,}))
    } catch (error) {
        updateMailStatus(mail.id, 500, `ERROR: ${subject}, ${mailTo}, ${JSON.stringify(error)}`)
            .then(() => updateGameAction({
                    ...action,
                    status: 500,
                    statusTxt: `ERROR: ${JSON.stringify(error)}`,
                })
            )
    }
}

const sendGameZusage = async ({
                                  gameId,
                                  playerIds,
                              }: {
    gameId: string;
    playerIds: string[];
}) => {
    const game = await getGameById(gameId);
    invariant(game !== null);

    const action = await createGameAction({
        gameId,
        actionType: "GAME_ZUSAGE",
    });

    for (let i = 0; i < playerIds.length; i++) {
        const player = await getPlayerById(playerIds[i]);
        invariant(player !== null);

        const gameTime = dateUtils.dateTimeToFormat({
            value: DateTime.fromJSDate(new Date(game.gameTime)),
        });
        const subject = mailContent.zusageMail.mailSubject(gameTime);
        const body = mailContent.zusageMail.mailBody({
            datum: gameTime,
            spielOrt: messages.adminGameInvitationForm.spielort(game.spielort),
            playerName: player.name,
        });
        const mailTo = player.email;
        const mailData: MailData = {
            playerId: player.id,
            playerName: player.name,
            actionId: action.id,
            status: 200,
            gameId: game.id,
            statusTxt: `${subject}, ${mailTo}`,
            mailType: "GAME_ZUSAGE",
        }
        doSendMail(mailTo, subject, body, mailData, action);
    }
};

const sendGameAbsage = async ({
                                  gameId,
                                  playerIds,
                              }: {
    gameId: string;
    playerIds: string[];
}) => {
    const game = await getGameById(gameId);
    invariant(game !== null);

    const action = await createGameAction({
        gameId,
        actionType: "GAME_ABSAGE",
    });

    for (let i = 0; i < playerIds.length; i++) {
        const player = await getPlayerById(playerIds[i]);
        invariant(player !== null);

        const gameTime = dateUtils.dateTimeToFormat({
            value: DateTime.fromJSDate(new Date(game.gameTime)),
        });
        const subject = mailContent.absageMail.mailSubject(gameTime);
        const body = mailContent.absageMail.mailBody({
            datum: gameTime,
            playerName: player.name,
        });
        const mailTo = player.email;
        const mailData: MailData = {
            playerId: player.id,
            playerName: player.name,
            actionId: action.id,
            status: 200,
            gameId: game.id,
            statusTxt: `${subject}, ${mailTo}`,
            mailType: "GAME_ABSAGE",
        }
        doSendMail(mailTo, subject, body, mailData, action);
    }
};

export default {
    sendGameInvitation,
    sendGameZusage,
    sendGameAbsage,
};
