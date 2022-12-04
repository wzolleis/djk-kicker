import messages from "~/components/i18n/messages";

export enum actionTypes {
    GAME_ZUSAGE = "GAME_ZUSAGE",
    GAME_ABSAGE = "GAME_ABSAGE",
    GAME_INVITATION = "GAME_INVITATION"
}

export type actionTypeKey = keyof typeof actionTypes;

export const isActionType = (value: string): value is actionTypes => {
    return (value === actionTypes.GAME_ABSAGE || value === actionTypes.GAME_INVITATION || value === actionTypes.GAME_ZUSAGE)
}

export const actionTypeLabel = (action: actionTypes) => {
    return messages.actionType[action] || action
}