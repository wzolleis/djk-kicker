import type {ActionFunction, LoaderFunction} from "@remix-run/node";
import {json, redirect} from "@remix-run/node";
import invariant from "tiny-invariant";
import {Link, useLoaderData} from "@remix-run/react";
import type {Prisma} from "@prisma/client";
import {getPlayerFeedbackForGame, updateFeedback} from "~/models/feedback.server";
import {Form} from "@remix-run/react";
import type {FeedbackForm} from "~/helpers/formdata/feedback.formdata.server";
import {getFeedbackForm} from "~/helpers/formdata/feedback.formdata.server";
import {updatePlayer} from "~/models/player.server";
import PlayerForm from "~/components/player/PlayerForm";
import PageHeader from "~/components/common/PageHeader";

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
}

export const loader: LoaderFunction = async ({params}) => {
    invariant(params.gameId, "Help");
    invariant(params.playerId, "Help");
    const gameId = params.gameId;
    const playerId = params.playerId;
    const playerWithFeedback: PlayerFeedbackForGame | null = await getPlayerFeedbackForGame(playerId, gameId);


    return json({player: playerWithFeedback, gameId});
};


export const action: ActionFunction = async ({params: {gameId, playerId}, request}) => {
    const formData = await request.formData();
    const submittedForm: FeedbackForm = getFeedbackForm(formData);
    await updateFeedback(playerId!, gameId!, submittedForm.feedback.status, submittedForm.feedback.note);
    await updatePlayer(playerId!, submittedForm.player.name, submittedForm.player.email);
    return redirect(`/application/games/${gameId}`);

};


const EditPlayerFeedback = () => {
    const {player} = useLoaderData() as LoaderData;


    // @ts-ignore
    return (
        <>
            <PageHeader title={"Status bearbeiten"}></PageHeader>
            <PlayerForm player={player}></PlayerForm>
        </>
    );


};

export default EditPlayerFeedback;