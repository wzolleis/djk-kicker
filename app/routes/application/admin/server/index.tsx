import Environment from "~/routes/application/admin/server/environment";
import {json, LoaderFunction} from "@remix-run/node";
import {useLoaderData} from "@remix-run/react";

export type ProcessEnvVariables = {
    DRIFTMAIL_SERVICE_URL: string | undefined
}

type LoaderData = {
    variables: ProcessEnvVariables
};

export const loader: LoaderFunction = async () => {
    const variables: ProcessEnvVariables = {
        DRIFTMAIL_SERVICE_URL: process.env.DRIFTMAIL_SERVICE_URL
    }
    return json<LoaderData>({variables});
};

const ServerIndex = () => {
    const data = useLoaderData() as unknown as LoaderData

    return (
        <div>
            <Environment variables={data.variables}/>
        </div>
    )
}

export default ServerIndex