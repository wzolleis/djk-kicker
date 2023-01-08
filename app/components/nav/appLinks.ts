import messages from "~/components/i18n/messages";
import routeLinks from "~/config/routeLinks";

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
        dashboard: {
            requiresAdmin: false,
            path: "dashboard",
            label: messages.appmenu.dashboard
        },

        games: {
            requiresAdmin: false,
            path: "games",
            label: messages.appmenu.games
        },
        users: {
            create: {
                requiresAdmin: false,
                path: routeLinks.player.create,
                label: messages.appmenu.createPlayer
            }
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