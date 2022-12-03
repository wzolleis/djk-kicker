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


export const config = {
    status: statusInConfig,
    gameLocations: gameLocations,
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
                invite: "Einladung"
            },
            values: {
                edit: "edit",
                status: "status",
                invite: "invite"
            }
        }


    }
}





