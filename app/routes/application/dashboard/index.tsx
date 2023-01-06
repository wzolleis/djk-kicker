import {authenticatePlayer} from "~/utils/session.server";
import {DefaultFeedback, Feedback, Player} from "@prisma/client";
import {ActionFunction, json, LoaderFunction, redirect,} from "@remix-run/node";
import {Form, useActionData, useLoaderData} from "@remix-run/react";
import {getGameById, getMostRecentGame} from "~/models/games.server";
import {findFeedbackWithPlayerIdAndGameId, getDefaultFeedback, updateFeedback,} from "~/models/feedback.server";
import PageHeader from "~/components/common/PageHeader";
import {getPlayerGreeting} from "~/utils";
import {motion} from "framer-motion";
import routeLinks from "~/helpers/constants/routeLinks";
import {GameWithFeedback} from "~/config/gameTypes";
import animationConfig from "~/config/animationConfig";
import invariant from "tiny-invariant";
import _ from "lodash";
import {DashboardFormValues, getDashboardFormValues} from "~/components/dashboard/dashboardHelper";
import GameSummary from "~/components/dashboard/gameSummary";
import GameFeedback from "~/components/dashboard/gameFeedback";
import TransitionContainer from "~/components/common/container/transitionContainer";

export type LoaderData = {
    isAuthenticated: boolean;
    player: Player;
    nextGame: GameWithFeedback | null;
    nextGameFeedback: Feedback | null;
    defaultFeedback: DefaultFeedback;
};

type ActionData = {
    defaultFeedback?: DefaultFeedback;
    gameFeedback?: Feedback
    player?: Player
};

export const action: ActionFunction = async ({params, request}) => {
    const {player} = await authenticatePlayer(params, request);
    const formData = await request.formData();
    const gameId = formData.get("gameId")

    if (!player) {
        return redirect(routeLinks.playerNotAuthenticated);
    }
    if (!gameId) {
        throw new Error("No GameId provided");
    }

    invariant(typeof gameId === 'string', "invalid gameId")
    const formValues: DashboardFormValues = getDashboardFormValues(formData, player.id, gameId)
    const {intent, feedback} = formValues

    if (intent === "playerFeedback") {
        invariant(!!feedback, "Feedback is undefined")
        const feedbackUpdate = await updateFeedback(player.id, gameId, feedback.status, feedback.playerCount, feedback.note)
        return json<ActionData>({
            gameFeedback: feedbackUpdate
        })
    }
};

export const loader: LoaderFunction = async ({params, request}) => {
    const {isAuthenticated, player} = await authenticatePlayer(params, request);
    if (!player) {
        return redirect(routeLinks.playerNotAuthenticated);
    }
    const defaultFeedback = await getDefaultFeedback(player.id);
    const nextGame = await getMostRecentGame();
    const nextGameWithFeedBack = !!nextGame ? await getGameById(nextGame.id) : null
    const nextGameFeedback = !!nextGame ? await findFeedbackWithPlayerIdAndGameId(player.id, nextGame.id) : null

    return json<LoaderData>({
        isAuthenticated,
        player,
        nextGame: nextGameWithFeedBack,
        nextGameFeedback,
        defaultFeedback,
    });
};


const Dashboard = () => {
    const {player, nextGame, nextGameFeedback, defaultFeedback} = useLoaderData() as unknown as LoaderData;
    const actionData = useActionData<ActionData>()

    const playerWithUpdate: Player = _.merge(player, actionData?.player)
    const feedbackWithUpdate: Feedback = _.merge(nextGameFeedback, actionData?.gameFeedback)
    const defaultFeedbackWithUpdate: DefaultFeedback = _.merge(defaultFeedback, actionData?.defaultFeedback)

    return (
        <TransitionContainer>
            <Form method={"post"} key={"dashboard"}>
                <input type={"hidden"} name={"gameId"} value={nextGame?.id}/>
                <PageHeader title={getPlayerGreeting(playerWithUpdate.name)}/>
                <motion.div
                    className={"flex flex-col gap-4"}
                    variants={animationConfig.container}
                    initial={"initial"}
                    animate={"animate"}
                    exit={"exit"}
                >
                    <motion.div variants={animationConfig.animationItems}>
                        <GameSummary nextGame={nextGame}/>
                    </motion.div>
                    <motion.div variants={animationConfig.animationItems}>
                        <GameFeedback nextGame={nextGame}
                                      nextGameFeedback={feedbackWithUpdate}
                                      defaultFeedback={defaultFeedbackWithUpdate}/>
                    </motion.div>
                </motion.div>
            </Form>
        </TransitionContainer>
    )
};

export default Dashboard;
