import type {ActionFunction, LoaderFunction} from "@remix-run/node";
import {json, redirect} from "@remix-run/node";
import invariant from "tiny-invariant";
import {Link, useLoaderData} from "@remix-run/react";
import type {Prisma} from "@prisma/client";
import {getPlayerFeedbackForGame, updateFeedback} from "~/models/feedback.server";
import type {FeedbackForm} from "~/helpers/formdata/feedback.formdata.server";
import {getFeedbackForm} from "~/helpers/formdata/feedback.formdata.server";
import {updatePlayer} from "~/models/player.server";
import EditPlayerStatusForm from "~/components/player/EditPlayerStatusForm";
import PageHeader from "~/components/common/PageHeader";
import {authenticateUser} from "~/utils/session.server";
import {NoTokenWarning} from "~/components/warnings/NoTokenWarning";

export type PlayerFeedbackForGame = Prisma.PlayerGetPayload<{
    include: {
        feedback: {
            where: {
                gameId: string
            },
        }
    }
}>

type LoaderData = {
    player: PlayerFeedbackForGame,
    isAuthenticated: boolean;
}

export const loader: LoaderFunction = async ({params, request}) => {
    invariant(params.gameId, "Help");
    invariant(params.playerId, "Help");
    const gameId = params.gameId;
    const playerId = params.playerId;
    const playerWithFeedback: PlayerFeedbackForGame | null = await getPlayerFeedbackForGame(playerId, gameId);
    const {isAuthenticated} = await authenticateUser(params, request)
    return json({player: playerWithFeedback, isAuthenticated});
};


export const action: ActionFunction = async ({params, request}) => {
    const formData = await request.formData();
    const submittedForm: FeedbackForm = getFeedbackForm(formData);
    const {isAuthenticated} = await authenticateUser(params, request)
    if (!isAuthenticated) {
        throw  json('no permission', 403)
    }
    await updateFeedback(params.playerId!, params.gameId!, submittedForm.feedback.status, submittedForm.feedback.note);
    await updatePlayer(params.playerId!, submittedForm.player.name, submittedForm.player.email);
    return redirect(`/application/games/${params.gameId}`);
};

const EditPlayerFeedback = () => {
    const {player, isAuthenticated} = useLoaderData() as LoaderData;


    // @ts-ignore
    return (
        <>
            <PageHeader title={"Status bearbeiten"}></PageHeader>
            <NoTokenWarning hidden={isAuthenticated}/>
            <EditPlayerStatusForm player={player} isAuthenticated={isAuthenticated}></EditPlayerStatusForm>
        </>
    );


};

export default EditPlayerFeedback;