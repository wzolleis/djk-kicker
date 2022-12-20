import { authenticatePlayer } from "~/utils/session.server";
import { DefaultFeedback, Feedback, Game, Player } from "@prisma/client";
import { ActionFunction, json, LoaderFunction, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getMostRecentGame } from "~/models/games.server";
import { findFeedbackWithPlayerIdAndGameId, getDefaultFeedback, updateDefaultFeedback } from "~/models/feedback.server";
import PageHeader from "~/components/common/PageHeader";
import { getPlayerGreeting } from "~/utils";
import ContentContainer from "~/components/common/container/ContentContainer";
import Subheading from "~/components/common/header/Subheading";
import { getDefaultFeedbackValues } from "~/utils/form.session";
import DefaultFeedbackComponent from "~/components/player/feedback/DefaultFeedbackComponent";
import { NextGame } from "~/components/game/NextGame";
import { motion } from "framer-motion";

type LoaderData = {
  isAuthenticated: boolean;
  player: Player;
  nextGame: Game | null;
  nextGameFeedback: Feedback | null;
  defaultFeedback: DefaultFeedback;
};

type ActionData = {
  newFeedback: DefaultFeedback;
};

export const action: ActionFunction = async ({ params, request }) => {
  const { isAuthenticated, player } = await authenticatePlayer(params, request);
  const body = await request.formData();
  const { status, note, playerCount } = getDefaultFeedbackValues(body);
  if (!player) {
    return redirect("/application/games");
  }
  const newFeedback = await updateDefaultFeedback(player.id, status, playerCount, note);
  return json<ActionData>({
    newFeedback,
  });
};

export const loader: LoaderFunction = async ({ params, request }) => {
  const { isAuthenticated, player } = await authenticatePlayer(params, request);
  if (!player) {
    return redirect("/application/games");
  }
  const defaultFeedback = await getDefaultFeedback(player.id);
  const nextGame = await getMostRecentGame();
  const nextGameFeedback = await findFeedbackWithPlayerIdAndGameId(player!.id, nextGame!.id);

  return json<LoaderData>({ isAuthenticated, player, nextGame, nextGameFeedback, defaultFeedback });
};
const Dashboard = () => {
  const { player, nextGame, nextGameFeedback, defaultFeedback } = useLoaderData() as unknown as LoaderData;
  const container = {
    initial: {
      opacity: 0,
    },
    animate: {
      opacity: 1,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.1,
      },
    },
  };

  const items = {
    initial: {
      y: 1100,
    },
    animate: {
      y: 0,
      transition: {
        ease: [0.6, 0.01, -0.05, 0.95],
        duration: 1,
      },
    },
  };

  return (
    <>
      <PageHeader title={getPlayerGreeting(player.name)}></PageHeader>
      <motion.div className={"flex flex-col gap-4 md:grid-cols-3 lg:grid"} variants={container} initial={"initial"} animate={"animate"}>
        <motion.div variants={items}>
          <ContentContainer>
            <Subheading title={"Standard-Status"} />
            <DefaultFeedbackComponent defaultFeedback={defaultFeedback} />
          </ContentContainer>
        </motion.div>
        <motion.div variants={items}>
          <ContentContainer>
            <Subheading title={"Nächstes Spiel"} />
            <NextGame game={nextGame!}></NextGame>
          </ContentContainer>
        </motion.div>
        <motion.div variants={items}>
          <ContentContainer>
            <Subheading title={"Letzte Spiele"} />
          </ContentContainer>
        </motion.div>
      </motion.div>
    </>
  );
};

export default Dashboard;
