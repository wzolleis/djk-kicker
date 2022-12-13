import type {LoaderFunction} from "@remix-run/node";
import {ActionFunction, json, redirect} from "@remix-run/node";
import {requireUserId} from "~/session.server";
import CreateUserForm from "~/components/users/admin/CreateUserForm";
import invariant from "tiny-invariant";
import {createUser} from "~/models/user.server";


export const loader: LoaderFunction = async ({request}: { request: Request }) => {
    await requireUserId(request)
    return json({})
}

export const action: ActionFunction = async ({request}: { request: Request }) => {
    const formData = await request.formData();
    const userName = formData.get("name")
    const userMail = formData.get("email")
    const intent = formData.get('intent')
    const password = formData.get("password")
    const passwordRepeat = formData.get("passwordRepeat")

    invariant(typeof intent === "string")
    invariant(typeof userName === "string")
    invariant(typeof userMail === "string")
    invariant(typeof password === "string")
    invariant(typeof passwordRepeat === "string")
    invariant(password === passwordRepeat)

    if (intent === 'cancel') {
        return redirect('application/admin/users')
    }

    await createUser(userMail, password)
    return redirect('application/admin/users')
}

export const NewAdmin = () => {
    return (
        <CreateUserForm/>
    )
}

export default NewAdmin