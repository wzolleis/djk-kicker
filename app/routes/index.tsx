import {LoaderFunction, redirect} from "@remix-run/node";
import routeLinks from "~/helpers/constants/routeLinks";

export const loader: LoaderFunction = async ({request}) => {
    return redirect(routeLinks.dashboard)
}

export default function Index() {
    return (<div>Hier ist nichts</div>)
}
