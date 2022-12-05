import {LoaderFunction, redirect} from "@remix-run/node";

export const loader: LoaderFunction = async () => {
    return redirect("/application/games")
}

const AppIndex = () => {
  return (
    <div>Weiterleitung auf games</div>
  )
}

export default AppIndex