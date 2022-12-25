import {LoaderFunction, redirect} from "@remix-run/node";
import routeLinks from "~/helpers/constants/routeLinks";

export const loader: LoaderFunction = async () => {
    return redirect(routeLinks.games)
}

const AppIndex = () => {
  return (
    <div>Weiterleitung auf games</div>
  )
}

export default AppIndex