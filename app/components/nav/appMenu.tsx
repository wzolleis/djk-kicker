import type { AppLink } from "~/components/nav/appLinks";
import { appLinks } from "~/components/nav/appLinks";

export type MenuEntry = {
    id: string
    appLink: AppLink
}

export const appMenu: { app: MenuEntry[] } = {
    app: [
        {
            id: "5fda6c32-e771-4598-b96b-d24d60209eef",
            appLink: appLinks.application.admin
        },
        {
            id: "7182e423-f2e7-4aa0-9231-bd04cd8217a1",
            appLink: appLinks.application.admin.events
        }
    ]
}



