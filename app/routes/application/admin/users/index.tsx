import {LoaderFunction, redirect} from "@remix-run/node";

export const loader: LoaderFunction = async () => {
    return redirect("/application/admin/users/users")
}

const AppIndex = () => {
    return (
        <div>Weiterleitung auf users</div>
    )
}

export default AppIndex