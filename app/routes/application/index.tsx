import {LoaderFunction, redirect} from "@remix-run/node";

export const loader: LoaderFunction = async ({request}) => {
    return redirect("/application/games")
}

const AppIndex = () => {
  return (
    <div>DJK App Index!!!</div>
  )
}

export default AppIndex