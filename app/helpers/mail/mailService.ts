import {MailTemplateType} from "~/config/mailTypes";
import {findGameById} from "~/models/games.server";
import {Game, Player} from "@prisma/client";
import {findManyPlayerById} from "~/models/player.server";
import invariant from "tiny-invariant";
import {createMailServiceRequest} from "~/models/mailservice.server";
import {DriftmailClient, DriftMailStatusResponse, Mail, Recipient} from "driftmail";
import {JobResponse} from "driftmail/build/GetStatusRequestResponse";
import {useDateTime} from "~/utils";
import messages from "~/components/i18n/messages";
import {createEncryptedPlayerToken} from "~/utils/token.server";
import mailLinkBuilder from "~/helpers/mail/mailLinkBuilder";

const driftMailClient = new DriftmailClient()

export type DriftMailJob = Omit<JobResponse, "failure_cause">;

export type FailedDriftMailJob = DriftMailJob & { failure_cause: string | null };


export class MailService {
    gameId: string
    templateName: MailTemplateType
    playerIds: string[]

    host: string


    // ===================================================
    // die nachfolgenden Werte werden nachgeladen oder
    // berechnet
    // ===================================================
    game: Game | null = null

    driftMail: Mail | null = null

    requestId: string | null = null

    player: Player[] = []
    statusResponse: DriftMailStatusResponse | null = null

    constructor(gameId: string, templateName: MailTemplateType, playerIds: string[], host: string) {
        this.gameId = gameId;
        this.templateName = templateName;
        this.playerIds = playerIds
        this.host = host
    }

    async sendGameMail(): Promise<{ requestId: string, status: DriftMailStatusResponse } | undefined> {
        await this.loadGameData()
        await this.loadPlayerData()
        await this.createDriftMailData()
        await this.sendDriftMail()
        await this.saveMailRequest()
        await this.fetchDriftMailStatus()

        // invariant(this.requestId, "Die ReqquestId ist null")
        // invariant(this.statusResponse, "Die StatusResponse ist null")
        if (!!this.requestId && !!this.statusResponse) {
            return {requestId: this.requestId, status: this.statusResponse}
        } else {
            return undefined
        }
    }

    private async loadGameData() {
        this.game = await findGameById(this.gameId)
        invariant(!!this.game, `das Spiel mit der ID '${this.gameId}' wurde nicht gefunden`)
    }

    private async loadPlayerData() {
        this.player = await findManyPlayerById(this.playerIds)
    }

    private async createDriftMailData() {
        invariant(!!this.game, "Game is null")
        invariant(!!this.host, "Host is null")

        const {id: gameId, gameTime, name: gameName, spielort} = this.game
        const mail = new Mail(this.templateName)
        mail.addVariable({
            event: {
                date: useDateTime(gameTime),
                name: gameName,
                location: messages.commonForm.spielort(spielort)
            }
        })

        for (let i = 0; i < this.player.length; i++) {
            const player = this.player[i]
            const token = await createEncryptedPlayerToken(player.id);
            const invitationLink = mailLinkBuilder.gameInvitationLink({host: this.host, gameId, token})
            const playerVariables = {
                invitationLink,
                name: player.name,
            }
            mail.addRecipient(new Recipient(player.email, playerVariables))
        }

        this.driftMail = mail
        invariant(!!this.driftMail, "Die Mail konnte nicht erzeugt werden")
    }

    private async sendDriftMail() {
        try {
            console.group("sendDriftMail")
            console.info('mail', JSON.stringify(this.driftMail, undefined, 2))
            this.requestId = await driftMailClient.send(this.driftMail!)
            // invariant(!!this.requestId, "die RequestId ist nicht gesetzt")
        } catch (error) {
            console.error('Fehler beim Senden der drift mail', error)
        } finally {
            console.groupEnd()
        }
    }

    private async saveMailRequest() {
        console.group("saveMailRequest")
        try {
            // invariant(!!this.requestId, "die RequestId ist nicht gesetzt")
            if (!this.requestId) {
                console.warn('Keine Request Id')
            } else {
                await createMailServiceRequest({
                    requestId: this.requestId,
                    gameId: this.gameId,
                    requestType: this.templateName,
                    requestPayload: JSON.stringify(this.driftMail, undefined, 2)
                })
            }
        } finally {
            console.groupEnd()
        }
    }

    private async fetchDriftMailStatus() {
        invariant(!!this.requestId, "die RequestId ist nicht gesetzt")
        this.statusResponse = await fetchDriftMailStatus(this.requestId)
    }
}

/**
 * Eine Abfrage des Status fuer einen Request, das ist eine eigene Methode, damit man den Status auch nur mit der Request-Id abfragen kann
 * @param requestId die die Drift-Mail-Request ID
 */
export const fetchDriftMailStatus = async (requestId: string): Promise<DriftMailStatusResponse> => {
    return await driftMailClient.getStatus(requestId)
}


