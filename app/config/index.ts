import {statusInConfig} from "~/config/status";
import {gameLocations} from "~/config/locations";
import {actionTypes} from "~/config/action";

export  const configuration = {
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