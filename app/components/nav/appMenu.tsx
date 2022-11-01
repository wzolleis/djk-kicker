import type { AppLink } from "~/components/nav/appLinks";
import { appLinks } from "~/components/nav/appLinks";

export type MenuEntry = {
    id: string
    appLink: AppLink
}

export const appMenu: { app: MenuEntry[] } = {
    app: [
        {
            id: "49331f29-6465-4c01-975d-bef01371d3fb",
            appLink: appLinks.application.equipment
        },
        {
            id: "52cd654e-9c65-4318-ac5c-4bf0b0d77038",
            appLink: appLinks.application.training
        }
    ]
}



