import {LoaderFunction, redirect} from "@remix-run/node";

export const loader: LoaderFunction = async () => {
    return redirect("/application/admin/invites/invites")
}

const AppIndex = () => {
    return (
        <div>Weiterleitung auf invites</div>
    )
}

export default AppIndex