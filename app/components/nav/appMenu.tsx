import type { AppLink } from "~/components/nav/appLinks";
import { appLinks } from "~/components/nav/appLinks";

export type MenuEntry = {
    id: string
    appLink: AppLink
}

export const appMenu: { app: MenuEntry[] } = {
    app: [
        {
            id: "eb935c65-3ebf-45f6-9547-3218fd209d0c",
            appLink: appLinks.application.games
        },
        {
            id: "5fda6c32-e771-4598-b96b-d24d60209eef",
            appLink: appLinks.application.admin
        }
    ]
}



