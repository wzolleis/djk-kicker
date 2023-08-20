import {statusInConfig} from "~/config/status";
import {actionTypes} from "~/config/action";

const GameLocationValues = ['Halle', 'Draussen', 'Spickelwiese', 'Gersthofen', 'Unbekannt'] as const
export type GameLocation = typeof GameLocationValues[number]

export const isGameLocation = (value: any): value is GameLocation => {
    return GameLocationValues.some(location => location === value)
}


export const configuration = {
    status: statusInConfig,
    gameLocations: {
        Unbekannt: 'Noch nicht bekannt',
        Halle: 'Halle Firnhaberau',
        Draussen: 'Wiese Firnhaberau',
        Spickelwiese: 'Spickelwiese',
        Gersthofen: 'Halle Gersthofen'
    },
    playerPositions: {
        Defender: 'Verteidiger',
        Attacker: 'Angreifer',
        Goalkeeper: 'Torwart'
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