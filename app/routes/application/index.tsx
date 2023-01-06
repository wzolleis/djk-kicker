import {ActionFunction, LoaderFunction, redirect} from "@remix-run/node";
import routeLinks from "~/helpers/constants/routeLinks";

export const action: ActionFunction = async () => {
    return redirect(routeLinks.dashboard)
}

export const loader: LoaderFunction = async () => {
    return redirect(routeLinks.dashboard)
}

const AppIndex = () => {
  return (
    <div>Weiterleitung auf dashboard</div>
  )
}

export default AppIndex