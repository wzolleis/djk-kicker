import { authenticatePlayer } from "~/utils/session.server";
import { Feedback, Game, Player } from "@prisma/client";
import { json, LoaderFunction, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getMostRecentGame } from "~/models/games.server";
import { findFeedbackWithPlayerIdAndGameId } from "~/models/feedback.server";
import PageHeader from "~/components/common/PageHeader";
import { getPlayerGreeting } from "~/utils";
import ContentContainer from "~/components/common/container/ContentContainer";

type LoaderData = {
  isAuthenticated: boolean;
  player: Player;
  nextGame: Game | null;
  nextGameFeedback: Feedback | null;
};

export const loader: LoaderFunction = async ({ params, request }) => {
  const { isAuthenticated, player } = await authenticatePlayer(params, request);
  if (!player) {
    return redirect("/application/games");
  }
  const nextGame = await getMostRecentGame();
  const nextGameFeedback = await findFeedbackWithPlayerIdAndGameId(player!.id, nextGame!.id);
  return json<LoaderData>({ isAuthenticated, player, nextGame, nextGameFeedback });
};
const Dashboard = () => {
  const { player, nextGame, nextGameFeedback } = useLoaderData<LoaderData>();
  return (
    <>
      <PageHeader title={getPlayerGreeting(player.name)}></PageHeader>
      <ContentContainer></ContentContainer>
    </>
  );
};

export default Dashboard;
