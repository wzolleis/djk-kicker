import {istStatusInConfig, statusInConfig} from "~/config/status";
import invariant from "tiny-invariant";


export type DashboardIntentValues = 'playerFeedback' | 'playerProfile'

export type DashboardFormInputName =
    "intent"
    | "dashboard.feedback.status" | "dashboard.feedback.playerCount" | "dashboard.feedback.note"
    | "dashboard.defaultFeedback.status" | "dashboard.defaultFeedback.playerCount" | "dashboard.defaultFeedback.note"
    | "dashboard.profile.player.name" | "dashboard.profile.player.email"

export const isDashboardIntent = (value: string): value is DashboardIntentValues => {
    return value === "playerFeedback" || value === "playerProfile"
}

export type DashboardFormValues = {
    gameId: string
    playerId: string
    intent: DashboardIntentValues
    feedback: {
        status: statusInConfig
        note: string
        playerCount: number
    }
    profile: {
        name: string
        email: string
    }
    defaultFeedback: {
        status: statusInConfig
        note: string
        playerCount: number
    }
}

export class DashboardForm {
    formData: FormData
    constructor(formData: FormData) {
        this.formData = formData
    }

    get(name: DashboardFormInputName): FormDataEntryValue | null {
        return this.formData.get(name)
    }
}

export const getDashboardFormValues = (formData: FormData, playerId: string, gameId: string): DashboardFormValues => {
    const dashboardForm = new DashboardForm(formData)

    const intent = dashboardForm.get("intent")
    const feedbackStatus = dashboardForm.get("dashboard.feedback.status") ?? `${statusInConfig.unknown}`
    const feedbackPlayerCount = dashboardForm.get("dashboard.feedback.playerCount") ?? "0"
    const feedbackNote = dashboardForm.get("dashboard.feedback.note")
    const playerName = dashboardForm.get("dashboard.profile.player.name")
    const playerMail = dashboardForm.get("dashboard.profile.player.email")
    const defaultFeedbackStatus = dashboardForm.get("dashboard.defaultFeedback.status") ?? `${statusInConfig.unknown}`
    const defaultFeedbackPlayerCount = dashboardForm.get("dashboard.defaultFeedback.playerCount") ?? "0"
    const defaultFeedbackNote = dashboardForm.get("dashboard.defaultFeedback.note")

    invariant(typeof intent === 'string', "invalid intent type: " + intent)
    invariant(isDashboardIntent(intent), "invalid intent value: " + intent)

    invariant(typeof feedbackPlayerCount === 'string', "invalid player count type: " + feedbackPlayerCount)
    invariant(Number.isInteger(Number.parseInt(feedbackPlayerCount)), "invalid player count value " + feedbackPlayerCount)
    invariant(typeof feedbackStatus === 'string', "invalid status type: " + feedbackStatus)
    invariant(typeof feedbackNote === 'string', "invalid note type: " + feedbackNote)

    invariant(typeof defaultFeedbackPlayerCount === 'string', "invalid default_player_count type: " + defaultFeedbackPlayerCount)
    invariant(Number.isInteger(Number.parseInt(defaultFeedbackPlayerCount)), "invalid default_player_ count value" + defaultFeedbackPlayerCount)
    invariant(typeof defaultFeedbackStatus === 'string', "invalid default_status type: " + defaultFeedbackStatus)
    invariant(typeof defaultFeedbackNote === 'string', "invalid default_note type: " + defaultFeedbackNote)

    invariant(typeof playerName === 'string', "invalid player name type: " + playerName)
    invariant(typeof playerMail === 'string', "invalid player mail type: " + playerMail)

    const feedbackStatusNumber = Number.parseInt(feedbackStatus)
    const defaultFeedbackStatusNumber = Number.parseInt(defaultFeedbackStatus)
    invariant(istStatusInConfig(feedbackStatusNumber), "invalid feedback_status value: " + feedbackStatusNumber)
    invariant(istStatusInConfig(defaultFeedbackStatusNumber), "invalid feedback_status value: " + defaultFeedbackStatusNumber)

    return {
        gameId,
        playerId,
        intent,
        feedback: {
            status: feedbackStatusNumber,
            note: feedbackNote,
            playerCount: Number.parseInt(feedbackPlayerCount),
        },
        profile: {
            name: playerName,
            email: playerMail
        },
        defaultFeedback: {
            status: defaultFeedbackStatusNumber,
            note: defaultFeedbackNote,
            playerCount: Number.parseInt(defaultFeedbackPlayerCount)
        }
    }

}
