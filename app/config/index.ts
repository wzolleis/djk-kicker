import {statusInConfig} from "~/config/status";
import {actionTypes} from "~/config/action";

const GameLocationValues = ['Halle', 'Draussen', 'Spickelwiese', 'Gersthofen'] as const
export type GameLocation = typeof GameLocationValues[number]

export const isGameLocation = (value: any): value is GameLocation => {
    return GameLocationValues.some(location => location === value)
}


export const configuration = {
    status: statusInConfig,
    gameLocations: {
        Halle: 'Halle (Schule Firnhaberau)',
        Draussen: 'Draussen (Wiese Vereinsheim)',
        Spickelwiese: 'Draussen (Spickelwiese)',
        Gersthofen: 'Halle (Paul-Klee-Gymnasium Gersthofen)'
    },
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