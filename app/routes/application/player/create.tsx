import {useLoaderData} from "@remix-run/react";
import {ActionFunction, json, redirect} from "@remix-run/node";
import CreatePlayerForm from "~/components/player/CreatePlayerForm";
import {getQueryParams} from "~/utils";
import PageHeader from "~/components/common/PageHeader";
import messages from "~/components/i18n/messages";
import MainPageContent from "~/components/common/MainPageContent";
import {createPlayer} from "~/models/player.server";
import {createFeedback} from "~/models/feedback.server";
import {determineStatus} from "~/helpers/formdata/feedback.formdata.server";


type LoaderData = {
    gameid: string,
}

export const loader = async ({params, request}: { params: any, request: any }) => {
    const {gameid} = getQueryParams(request, "gameid")
    return json({gameid})


};

export const action: ActionFunction = async ({request}: { request: Request }) => {
    const formData = await request.formData();
    const {gameid} = getQueryParams(request, "gameid");
    const player = await createPlayer(formData.get("name")!.toString(), formData.get("mail")!.toString())
    if (gameid) {
        await createFeedback(player.id, gameid, determineStatus(formData.get("status")!.toString()), formData.get("note")!.toString())
    }
    return redirect(`application/games${gameid ? `/${gameid}` : ""}`)

}


const CreatePlayer = () => {
    const {gameid} = useLoaderData<LoaderData>();
    return (
        <>
            <PageHeader title={messages.player.add}></PageHeader>
            <MainPageContent> <CreatePlayerForm gameId={gameid}/></MainPageContent>
        </>
    );


};

export default CreatePlayer;