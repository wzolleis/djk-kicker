import type {LoaderFunction} from "@remix-run/node";
import {requireUserId} from "~/session.server";


export const loader: LoaderFunction = async ({request}: { request: Request }) => {
    await requireUserId(request);


}

