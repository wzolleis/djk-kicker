export type AppLink = {
    path: string
    label: string
}

export const appLinks = {
    application: {
        path: "/application",
        label: "Start",
        equipment: {
            path: "equipments",
            label: "Geräte"
        },
        training: {
            path: "trainings",
            label: "Training"
        }
    },
}