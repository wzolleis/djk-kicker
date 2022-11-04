import messages from "~/components/i18n/messages";

export type AppLink = {
    path: string
    label: string
}

export const appLinks = {
    application: {
        path: "/application",
        label: "Start",
        games: {
            path: "games",
            label: messages.appmenu.games
        },
        admin: {
            path: "admin",
            label: messages.appmenu.administration,
            games: {
                path: "admin/games",
                label: messages.appmenu.gameadministration
            }
        }
    }
}