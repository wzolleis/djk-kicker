import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import { useLoaderData } from "@remix-run/react";
import type { Prisma } from "@prisma/client";
import { getPlayerFeedbackForGame, updateFeedback } from "~/models/feedback.server";
import type { FeedbackForm } from "~/helpers/formdata/feedback.formdata.server";
import { getFeedbackForm } from "~/helpers/formdata/feedback.formdata.server";
import { updatePlayer } from "~/models/player.server";
import EditPlayerStatusForm from "~/components/player/EditPlayerStatusForm";
import PageHeader from "~/components/common/PageHeader";
import { authenticatePlayer } from "~/utils/session.server";
import { NoTokenWarning } from "~/components/warnings/NoTokenWarning";

export type PlayerFeedbackForGame = Prisma.PlayerGetPayload<{
  include: {
    feedback: {
      where: {
        gameId: string;
      };
    };
  };
}>;
type LoaderData = {
  player: PlayerFeedbackForGame;
  isAuthenticated: boolean;
};

export const loader: LoaderFunction = async ({ params, request }) => {
  const gameId = params.gameId;
  const playerId = params.playerId;
  invariant(gameId, "Help");
  invariant(playerId, "Help");

  const playerWithFeedback: PlayerFeedbackForGame | null = await getPlayerFeedbackForGame(playerId, gameId);
  const { player } = await authenticatePlayer(params, request);
  const isAuthenticated = player!.id === playerId;
  return json({ player: playerWithFeedback, isAuthenticated });
};

export const action: ActionFunction = async ({ params, request }) => {
  const gameId = params.gameId;
  const playerId = params.playerId;
  invariant(gameId, "Help");
  invariant(playerId, "Help");
  const { player } = await authenticatePlayer(params, request);
  const isAuthenticated = player!.id === playerId;

  if (!isAuthenticated) {
    throw json("no permission", 403);
  }

  const formData = await request.formData();
  const submittedForm: FeedbackForm = getFeedbackForm(formData);
  invariant(submittedForm.feedback.status, "invalid Feedback");

  await updateFeedback(params.playerId!, gameId, submittedForm.feedback.status, submittedForm.feedback.note);
  await updatePlayer(params.playerId!, submittedForm.player.name, submittedForm.player.email);
  return redirect(`/application/games/${params.gameId}`);
};

const EditPlayerFeedback = () => {
  const { player, isAuthenticated } = useLoaderData() as LoaderData;

  // @ts-ignore
  return (
    <>
      <PageHeader title={"Status bearbeiten"}></PageHeader>
      <NoTokenWarning hidden={isAuthenticated} />
      <EditPlayerStatusForm player={player} isAuthenticated={isAuthenticated}></EditPlayerStatusForm>
    </>
  );
};

export default EditPlayerFeedback;
