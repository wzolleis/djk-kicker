export type AppLink = {
    path: string
    label: string
}

export const appLinks = {
    application: {
        path: "/application",
        label: "Start",
        admin: {
            path: "admin",
            label: "Administration",
            games: {
                path: "admin/games",
                label: "Spiele"
            }
        }
    },
}