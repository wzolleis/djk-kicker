import {authenticatePlayer} from "~/utils/session.server";
import {DefaultFeedback, Feedback, Player} from "@prisma/client";
import {ActionFunction, json, LoaderFunction, redirect,} from "@remix-run/node";
import {Form, useActionData, useLoaderData} from "@remix-run/react";
import {getGameById, getMostRecentGame} from "~/models/games.server";
import {findFeedbackWithPlayerIdAndGameId, updateFeedback,} from "~/models/feedback.server";
import PageHeader from "~/components/common/PageHeader";
import {getPlayerGreeting} from "~/utils";
import routeLinks from "~/config/routeLinks";
import {GameWithFeedback} from "~/config/applicationTypes";
import invariant from "tiny-invariant";
import _ from "lodash";
import {DashboardFormValues, getDashboardFormValues} from "~/components/dashboard/dashboardHelper";
import GameSummary from "~/components/dashboard/gameSummary";
import GameFeedback from "~/components/dashboard/gameFeedback";
import TransitionContainer from "~/components/common/container/transitionContainer";
import {useDefaultFeedback} from "~/utils/playerUtils";

export type LoaderData = {
    isAuthenticated: boolean;
    player: Player;
    nextGame: GameWithFeedback | null;
    nextGameFeedback: Feedback | null;
};

type ActionData = {
    defaultFeedback?: DefaultFeedback;
    gameFeedback?: Feedback
    player?: Player
};

export const action: ActionFunction = async ({ request}) => {
    const {player} = await authenticatePlayer(request);
    const formData = await request.formData();
    const gameId = formData.get("gameId")
    const feedbackId = formData.get("feedbackId")

    if (!player) {
        return redirect(routeLinks.playerNotAuthenticated);
    }
    if (!gameId) {
        throw new Error("No GameId provided");
    }
    if (!feedbackId) {
        throw new Error("No Feedback provided");
    }

    invariant(typeof gameId === 'string', "invalid gameId")
    invariant(typeof feedbackId === "string", "invalid feedback id type")
    const formValues: DashboardFormValues = getDashboardFormValues(formData, player.id, gameId)
    const {intent, feedback} = formValues

    if (intent === "playerFeedback") {
        invariant(!!feedback, "Feedback is undefined")
        updateFeedback(player.id, gameId, feedback.status, feedback.playerCount, feedback.note)
        return json<ActionData>({
            gameFeedback: {
                id: feedbackId,
                playerId: player.id,
                gameId: gameId,
                ...feedback
            }
        })
    }
};

export const loader: LoaderFunction = async ({ request}) => {
    const {isAuthenticated, player} = await authenticatePlayer(request);
    if (!player) {
        return redirect(routeLinks.playerNotAuthenticated);
    }
    const nextGame = await getMostRecentGame();
    const nextGameWithFeedBack = !!nextGame ? await getGameById(nextGame.id) : null
    const nextGameFeedback = !!nextGame ? await findFeedbackWithPlayerIdAndGameId(player.id, nextGame.id) : null

    return json<LoaderData>({
        isAuthenticated,
        player,
        nextGame: nextGameWithFeedBack,
        nextGameFeedback,
    });
};


const Dashboard = () => {
    const {player, nextGame, nextGameFeedback} = useLoaderData() as unknown as LoaderData;
    const actionData = useActionData<ActionData>()
    const defaultFeedback = useDefaultFeedback()

    const playerWithUpdate: Player = _.merge(player, actionData?.player)
    const feedbackWithUpdate: Feedback = _.merge(nextGameFeedback, actionData?.gameFeedback)
    const defaultFeedbackWithUpdate: DefaultFeedback = _.merge(defaultFeedback, actionData?.defaultFeedback)
    const playerFeedback = nextGame?.feedback?.find((feedback) => feedback.playerId === player.id)

    return (
        <TransitionContainer>
            <PageHeader title={getPlayerGreeting(playerWithUpdate.name)}/>
            <GameSummary nextGame={nextGame}/>
            <Form method={"post"} key={"dashboard"}>
                <input type={"hidden"} name={"gameId"} value={nextGame?.id}/>
                <input type={"hidden"} name={"feedbackId"} value={playerFeedback?.id}/>
                <GameFeedback nextGame={nextGame}
                              nextGameFeedback={feedbackWithUpdate}
                              defaultFeedback={defaultFeedbackWithUpdate}/>
            </Form>
        </TransitionContainer>
    )
};

export default Dashboard;
