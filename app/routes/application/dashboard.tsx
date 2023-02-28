import {DefaultFeedback, Feedback, Player} from "@prisma/client";
import {ActionFunction, json, LoaderFunction, redirect,} from "@remix-run/node";
import {Form, useActionData, useLoaderData} from "@remix-run/react";
import _ from "lodash";
import invariant from "tiny-invariant";
import TransitionContainer from "~/components/common/container/transitionContainer";
import {DashboardFormValues, getDashboardFormValues,} from "~/components/dashboard/dashboardHelper";
import GameFeedback from "~/components/dashboard/gameFeedback";
import {GameWithFeedback} from "~/config/applicationTypes";
import routeLinks from "~/config/routeLinks";
import {findFeedbackWithPlayerIdAndGameId, updateFeedback,} from "~/models/feedback.server";
import {getGameById, getMostRecentGame} from "~/models/games.server";
import {getPlayerById} from "~/models/player.server";
import {useDefaultFeedback} from "~/utils/playerUtils";
import {authenticatePlayer} from "~/utils/session.server";

export type LoaderData = {
    isAuthenticated: boolean;
    player: Player;
    nextGame: GameWithFeedback | null;
    nextGameFeedback: Feedback | null;
};

type ActionData = {
    defaultFeedback?: DefaultFeedback;
    gameFeedback?: Feedback;
    player?: Player;
};

export const action: ActionFunction = async ({ request }) => {
    console.group('dashboard action')

    try {
        const {isAuthenticated, playerId} = await authenticatePlayer(request);
        const formData = await request.formData();
        const gameId = formData.get("gameId");
        const feedbackId = formData.get("feedbackId");

        if (!isAuthenticated) {
            return redirect(routeLinks.playerNotAuthenticated);
        }
        if (!gameId) {
            throw new Error("No GameId provided");
        }
        if (!feedbackId) {
            throw new Error("No Feedback provided");
        }

        invariant(typeof gameId === "string", "invalid gameId");
        invariant(typeof feedbackId === "string", "invalid feedback id type");
        invariant(!!playerId, "Keine PlayerId")

        const formValues: DashboardFormValues = getDashboardFormValues(
            formData,
            playerId,
            gameId
        );
        const {intent, feedback} = formValues;

        console.info('intent =', intent)


        if (intent === "playerFeedback") {
            console.info('update feedback with playerId = ', playerId)
            invariant(!!feedback, "Feedback is undefined");
            await updateFeedback(
                playerId,
                gameId,
                feedback.status,
                feedback.playerCount,
                feedback.note
            );
            return json<ActionData>({
                gameFeedback: {
                    id: feedbackId,
                    playerId: playerId,
                    gameId: gameId,
                    ...feedback,
                },
            });
        }
    } finally {
        console.groupEnd()
    }
};

export const loader: LoaderFunction = async ({ request }) => {
    const { isAuthenticated, playerId } = await authenticatePlayer(request);
    console.group('dashboard loader')
    console.info("dashboard: authenticated = ", isAuthenticated)

    try {
        if (!playerId) {
            return redirect(routeLinks.playerNotAuthenticated);
        }
        const player = await getPlayerById(playerId);
        if (!player) {
            return redirect(routeLinks.playerNotAuthenticated);
        }
        const nextGame = await getMostRecentGame();

        const nextGameWithFeedBack = !!nextGame
            ? await getGameById(nextGame.id)
            : null;
        const nextGameFeedback = !!nextGame
            ? await findFeedbackWithPlayerIdAndGameId(playerId, nextGame.id)
            : null;

        return json<LoaderData>({
            isAuthenticated,
            player,
            nextGame: nextGameWithFeedBack,
            nextGameFeedback,
        });
    } finally {
        console.groupEnd()
    }
};
const Dashboard = () => {
    const { player, nextGame, nextGameFeedback } =
        useLoaderData() as unknown as LoaderData;
    const actionData = useActionData<ActionData>();
    const defaultFeedback = useDefaultFeedback();

    const feedbackWithUpdate: Feedback = _.merge(
        nextGameFeedback,
        actionData?.gameFeedback
    );
    const defaultFeedbackWithUpdate: DefaultFeedback = _.merge(
        defaultFeedback,
        actionData?.defaultFeedback
    );
    const playerFeedback = nextGame?.feedback?.find(
        (feedback) => feedback.playerId === player.id
    );

    return (
        <TransitionContainer>
            <Form method={"post"} key={"dashboard"}>
                <input type={"hidden"} name={"gameId"} value={nextGame?.id} />
                <input
                    type={"hidden"}
                    name={"feedbackId"}
                    value={playerFeedback?.id}
                />
                <GameFeedback
                    nextGame={nextGame}
                    nextGameFeedback={feedbackWithUpdate}
                    defaultFeedback={defaultFeedbackWithUpdate}
                    player={player}
                />
            </Form>
        </TransitionContainer>
    );
};

export default Dashboard;
