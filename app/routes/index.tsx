import {LoaderFunction, redirect} from "@remix-run/node";
import routeLinks from "~/config/routeLinks";

export const loader: LoaderFunction = async () => {
    return redirect(routeLinks.dashboard)
}

export default function Index() {
    return (<div>Hier ist nichts</div>)
}
