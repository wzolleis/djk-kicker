import {istStatusInConfig, statusInConfig} from "~/config/status";
import invariant from "tiny-invariant";
import {FormWrapper} from "~/utils/formWrapper.server";


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
    feedback?: {
        status: statusInConfig
        note: string
        playerCount: number
    }
}

export const getDashboardFormValues = (formData: FormData, playerId: string, gameId: string): DashboardFormValues => {
    const dashboardForm = new FormWrapper<DashboardFormInputName>(formData)

    const intent = dashboardForm.get("intent")
    invariant(typeof intent === 'string', "invalid intent type: " + intent)
    invariant(isDashboardIntent(intent), "invalid intent value: " + intent)

    if (intent === "playerFeedback") {
        const feedbackStatus = dashboardForm.get("dashboard.feedback.status") ?? `${statusInConfig.unknown}`
        const feedbackPlayerCount = dashboardForm.get("dashboard.feedback.playerCount") ?? "0"
        const feedbackNote = dashboardForm.get("dashboard.feedback.note")

        invariant(typeof feedbackPlayerCount === 'string', "invalid player count type: " + feedbackPlayerCount)
        invariant(Number.isInteger(Number.parseInt(feedbackPlayerCount)), "invalid player count value " + feedbackPlayerCount)
        invariant(typeof feedbackStatus === 'string', "invalid status type: " + feedbackStatus)
        invariant(typeof feedbackNote === 'string', "invalid note type: " + feedbackNote)
        const feedbackStatusNumber = Number.parseInt(feedbackStatus)
        invariant(istStatusInConfig(feedbackStatusNumber), "invalid feedback_status value: " + feedbackStatusNumber)

        return {
            gameId,
            playerId,
            intent,
            feedback: {
                status: feedbackStatusNumber,
                note: feedbackNote,
                playerCount: Number.parseInt(feedbackPlayerCount),
            },
        }
    } else {
        throw Error("invalid intent " + intent)
    }
}
