import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import { useLoaderData } from "@remix-run/react";
import type { Prisma } from "@prisma/client";
import { getPlayerFeedbackForGame, updateFeedback } from "~/models/feedback.server";
import EditPlayerStatusForm from "~/components/player/EditPlayerStatusForm";
import PageHeader from "~/components/common/PageHeader";
import { authenticatePlayer } from "~/utils/session.server";
import { NoTokenWarning } from "~/components/warnings/NoTokenWarning";
import { getFeedbackValues } from "~/utils/form.session";
import { errors } from "~/components/i18n/errors";

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
  const playerId = params.playerId;
  const gameId = params.gameId!;
  const { player } = await authenticatePlayer(params, request);
  const isAuthenticated = player!.id === playerId;
  if (!isAuthenticated) {
    throw json("no permission", 403);
  }

  const formData = await request.formData();
  const { status, note, playerCount } = getFeedbackValues(formData);

  if (!gameId) {
    throw new Error(errors.game.updateFeedback.noGameId);
  }
  const newFeedback = await updateFeedback(playerId!, gameId, status, playerCount, note);

  if (formData.get("origin") === "dashboard") {
    return json({ newFeedback });
  }
  return redirect(`/application/games/${gameId}`);
};

const EditPlayerFeedback = () => {
  const { player, isAuthenticated } = useLoaderData() as LoaderData;

  // @ts-ignore
  return (
    <>
      <NoTokenWarning hidden={isAuthenticated} />
      <EditPlayerStatusForm player={player} isAuthenticated={isAuthenticated}></EditPlayerStatusForm>
    </>
  );
};

export default EditPlayerFeedback;
