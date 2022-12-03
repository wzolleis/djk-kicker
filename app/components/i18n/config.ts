import {ac} from "vitest/dist/global-58e8e951";

export enum statusInConfig {
    unknown,
    declined,
    confirmed,
    undecided
}


type statusInConfigType = {
    [key: string]: number
}

export type statusInConfigKey = keyof typeof statusInConfig

export enum gameLocations {
    "Halle",
    "Draussen"
}


export enum actionTypes {
    GAME_ZUSAGE = "Zusage",
    GAME_ABSAGE = "Absage",
    GAME_INVITATION = "Einladung"
}

export type actionTypeKey = keyof typeof actionTypes;

export const config = {
    status: statusInConfig,
    gameLocations: gameLocations,
    actionTypes: actionTypes,
    url: {
        links: {
            admin: {
                gamesOverView: "/application/admin/games"
            }
        },
        editGameForm: {
            translations: {
                edit: "Bearbeiten",
                status: "Status",
                invite: "Einladung",
                actions: "Verlauf"
            },
            values: {
                edit: "edit",
                status: "status",
                invite: "invite",
                actions: "actions"
            }
        }


    }
}





