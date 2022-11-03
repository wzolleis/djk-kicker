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
            label: "Verwaltung",
            games: {
                path: "admin/games",
                label: "Spiele"
            }
        }
    },
}