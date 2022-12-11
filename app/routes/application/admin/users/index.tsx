import type {LoaderFunction} from "@remix-run/node";
import {json} from "@remix-run/node";
import {requireUserId} from "~/session.server";
import React from "react";
import {Outlet} from "@remix-run/react";


export const loader: LoaderFunction = async ({request}: { request: Request }) => {
    await requireUserId(request)
    return json({})
}

export const NewAdmin = () => {
    return (
        <Outlet/>
    )
}

export default NewAdmin