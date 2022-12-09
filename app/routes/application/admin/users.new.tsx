import type {LoaderFunction} from "@remix-run/node";
import {json} from "@remix-run/node";
import {requireUserId} from "~/session.server";


export const loader: LoaderFunction = async ({request}: { request: Request }) => {
    await requireUserId(request)
    return json({})
}

export const NewAdmin = () => {
    return (
        <div>New Admin!!</div>
    )
}

export default NewAdmin