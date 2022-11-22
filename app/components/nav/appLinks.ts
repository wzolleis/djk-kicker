import messages from "~/components/i18n/messages";

export type AppLink = {
    path: string
    label: string
    requiresAdmin: boolean
}

export const appLinks = {
    application: {
        requiresAdmin: false,
        path: "/application",
        label: "Start",
        games: {
            requiresAdmin: false,
            path: "games",
            label: messages.appmenu.games
        },
        admin: {
            requiresAdmin: true,
            path: "admin",
            label: messages.appmenu.administration,
            games: {
                requiresAdmin: true,
                path: "admin/games",
                label: messages.appmenu.gameadministration
            },
            users: {
                requiresAdmin: true,
                path: 'admin/users',
                label: messages.appmenu.useradministration
            }
        }
    }
}