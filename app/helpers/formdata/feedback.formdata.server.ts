import type {Nullable} from "vitest";

export function determineStatus(status: string) {

    if (status === "unknown") {
        return null;
    } else return Boolean(parseInt(status));
}


export type FeedbackForm = {
    player: {
        name: string,
        email: string
    },
    feedback: {
        status: Nullable<number>,
        note: Nullable<string>
    }


}


export function getFeedbackForm(formData: FormData): FeedbackForm {
    const playerName = formData.get("playerName")!.toString();
    const playerMail = formData.get("playerMail")!.toString();

    const feedbackStatus = parseInt(formData.get('feedbackStatus')!.toString())
    const feedbackNote = formData.get("feedbackNote")!.toString();

    return {
        player: {
            name: playerName,
            email: playerMail
        },
        feedback: {
            status: feedbackStatus,
            note: feedbackNote
        }
    }
}