import {MailTemplateType} from "~/config/mailTypes";
import {findGameById} from "~/models/games.server";
import {Game, Player} from "@prisma/client";
import {getPlayerByIds} from "~/models/player.server";
import {createDriftMailData} from "~/helpers/mail/mailServiceHelper";
import invariant from "tiny-invariant";
import {createMailServiceRequest} from "~/models/mailservice.server";
import {DriftmailClient, DriftMailStatusResponse, Mail} from "driftmail";
import {JobResponse} from "driftmail/build/GetStatusRequestResponse";

const driftMailClient = new DriftmailClient()

export type DriftMailJob = Omit<JobResponse, "failure_cause">;

export type FailedDriftMailJob = DriftMailJob & { failure_cause: string | null };


export class MailService {
    gameId: string
    templateName: MailTemplateType
    playerIds: string[]

    host: string


    // ===================================================
    // ---------- wird nachgeladen oder berechnet --------
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
    async sendGameMail() {
        await this.loadGameData()
        await this.loadPlayerData()
        await this.createDriftMailData()
        await this.sendDriftMail()
        await this.saveMailRequest()
        await this.fetchDriftMailStatus()
    }

    private async loadGameData() {
        this.game = await findGameById(this.gameId)
        invariant(!!this.game, `das Spiel mit der ID '${this.gameId}' wurde nicht gefunden`)
    }

    private async loadPlayerData() {
        this.player = await getPlayerByIds(this.playerIds)
    }

    private async createDriftMailData() {
        this.driftMail = await createDriftMailData({
            game: this.game!,
            mailTemplate: this.templateName,
            allPlayer: this.player,
            host: this.host
        })

        invariant(!!this.driftMail, "Die Mail konnte nicht erzeugt werden")
    }

    private async sendDriftMail() {
        this.requestId = await driftMailClient.send(this.driftMail!)
        invariant(!!this.requestId, "die RequestId ist nicht gesetzt")
    }

    private async saveMailRequest() {
        invariant(!!this.requestId, "die RequestId ist nicht gesetzt")
        await createMailServiceRequest({
            requestId: this.requestId,
            gameId: this.gameId,
            requestType: this.templateName,
            requestPayload: JSON.stringify(this.driftMail)
        })
    }

    private async fetchDriftMailStatus() {
        invariant(!!this.requestId, "die RequestId ist nicht gesetzt")
        this.statusResponse = await fetchDriftMailStatus(this.requestId)
    }
}

/**
 * Eine Abfrage des Status fuer einen Request
 * @param requestId die RequestId
 */
export const fetchDriftMailStatus = async (requestId: string): Promise<DriftMailStatusResponse> => {
    return await driftMailClient.getStatus(requestId)
}


