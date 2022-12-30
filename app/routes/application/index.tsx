import {LoaderFunction, redirect} from "@remix-run/node";
import routeLinks from "~/helpers/constants/routeLinks";

export const loader: LoaderFunction = async () => {
    return redirect(routeLinks.dashboard)
}

const AppIndex = () => {
  return (
    <div>Weiterleitung auf dashboard</div>
  )
}

export default AppIndex