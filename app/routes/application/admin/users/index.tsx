import {LoaderFunction, redirect} from "@remix-run/node";
import routeLinks from "~/config/routeLinks";

export const loader: LoaderFunction = async () => {
    return redirect(routeLinks.admin.users.useradministration)
}

const AppIndex = () => {
    return (
        <div>Weiterleitung auf users</div>
    )
}

export default AppIndex