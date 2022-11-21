import messages from "~/components/i18n/messages";

export type AppLink = {
    path: string
    label: string
    admin: boolean
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
            admin: true,
            label: messages.appmenu.administration,
            games: {
                admin: true,
                path: "admin/games",
                label: messages.appmenu.gameadministration
            }
        }
    }
}