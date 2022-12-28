import {authenticatePlayer} from "~/utils/session.server";
import {DefaultFeedback, Feedback, Player} from "@prisma/client";
import {ActionFunction, json, LoaderFunction, redirect,} from "@remix-run/node";
import {Form, useLoaderData} from "@remix-run/react";
import {getGameById, getMostRecentGame} from "~/models/games.server";
import {findFeedbackWithPlayerIdAndGameId, getDefaultFeedback, updateFeedback,} from "~/models/feedback.server";
import PageHeader from "~/components/common/PageHeader";
import {getPlayerGreeting} from "~/utils";
import {motion} from "framer-motion";
import routeLinks from "~/helpers/constants/routeLinks";
import {GameWithFeedback} from "~/config/gameTypes";
import animationConfig from "~/config/animationConfig";
import invariant from "tiny-invariant";
import PlayerProfile from "~/components/dashbaord/playerProfile";
import GameFeedback from "~/components/dashbaord/gameFeedback";
import GameSummary from "~/components/dashbaord/gameSummary";
import {istStatusInConfig, statusInConfig} from "~/config/status";

type LoaderData = {
    isAuthenticated: boolean;
    player: Player;
    nextGame: GameWithFeedback | null;
    nextGameFeedback: Feedback | null;
    defaultFeedback: DefaultFeedback;
};

type ActionData = {
    defaultFeedback?: DefaultFeedback;
    gameFeedback?: Feedback;
};

type DashboardIntentValues = 'playerFeedback' | 'playerProfile'


type DashboardFormInputName =
    "intent"
    | "dashboard.feedback.status" | "dashboard.feedback.playerCount" | "dashboard.feedback.note"
    | "dashboard.defaultFeedback.status" | "dashboard.defaultFeedback.playerCount" | "dashboard.defaultFeedback.note"
    | "dashboard.profile.player.name" | "dashboard.profile.player.email"

const isDashboardIntent = (value: string): value is DashboardIntentValues => {
    return value === "playerFeedback" || value === "playerProfile"
}

type DashboardFormValues = {
    gameId: string
    playerId: string
    intent: DashboardIntentValues
    feedback: {
        status: statusInConfig
        note: string
        playerCount: number
    }
    profile: {
        name: string
        email: string
    }
    defaultFeedback: {
        status: statusInConfig
        note: string
        playerCount: number
    }
}

class DashboardForm {
    formData: FormData
    constructor(formData: FormData) {
        this.formData = formData
    }

    get(name: DashboardFormInputName): FormDataEntryValue | null {
        return this.formData.get(name)
    }
}

const getDashboardFormValues = (formData: FormData, playerId: string, gameId: string): DashboardFormValues => {
    const dashboardForm = new DashboardForm(formData)

    const intent = dashboardForm.get("intent")
    const feedbackStatus = dashboardForm.get("dashboard.feedback.status") ?? `${statusInConfig.unknown}`
    const feedbackPlayerCount = dashboardForm.get("dashboard.feedback.playerCount") ?? "0"
    const feedbackNote = dashboardForm.get("dashboard.feedback.note")
    const playerName = dashboardForm.get("dashboard.profile.player.name")
    const playerMail = dashboardForm.get("dashboard.profile.player.email")
    const defaultFeedbackStatus = dashboardForm.get("dashboard.defaultFeedback.status") ?? `${statusInConfig.unknown}`
    const defaultFeedbackPlayerCount = dashboardForm.get("dashboard.defaultFeedback.playerCount") ?? "0"
    const defaultFeedbackNote = dashboardForm.get("dashboard.defaultFeedback.note")

    invariant(typeof intent === 'string', "invalid intent type: " + intent)
    invariant(isDashboardIntent(intent), "invalid intent value: " + intent)

    invariant(typeof feedbackPlayerCount === 'string', "invalid player count type: " + feedbackPlayerCount)
    invariant(Number.isInteger(Number.parseInt(feedbackPlayerCount)), "invalid player count value " + feedbackPlayerCount)
    invariant(typeof feedbackStatus === 'string', "invalid status type: " + feedbackStatus)
    invariant(typeof feedbackNote === 'string', "invalid note type: " + feedbackNote)

    invariant(typeof defaultFeedbackPlayerCount === 'string', "invalid default_player_count type: " + defaultFeedbackPlayerCount)
    invariant(Number.isInteger(Number.parseInt(defaultFeedbackPlayerCount)), "invalid default_player_ count value" + defaultFeedbackPlayerCount)
    invariant(typeof defaultFeedbackStatus === 'string', "invalid default_status type: " + defaultFeedbackStatus)
    invariant(typeof defaultFeedbackNote === 'string', "invalid default_note type: " + defaultFeedbackNote)

    invariant(typeof playerName === 'string', "invalid player name type: " + playerName)
    invariant(typeof playerMail === 'string', "invalid player mail type: " + playerMail)

    const feedbackStatusNumber = Number.parseInt(feedbackStatus)
    const defaultFeedbackStatusNumber = Number.parseInt(defaultFeedbackStatus)
    invariant(istStatusInConfig(feedbackStatusNumber), "invalid feedback_status value: " + feedbackStatusNumber)
    invariant(istStatusInConfig(defaultFeedbackStatusNumber), "invalid feedback_status value: " + defaultFeedbackStatusNumber)

    return {
        gameId,
        playerId,
        intent,
        feedback: {
            status: feedbackStatusNumber,
            note: feedbackNote,
            playerCount: Number.parseInt(feedbackPlayerCount),
        },
        profile: {
            name: playerName,
            email: playerMail
        },
        defaultFeedback: {
            status: defaultFeedbackStatusNumber,
            note: defaultFeedbackNote,
            playerCount: Number.parseInt(defaultFeedbackPlayerCount)
        }
    }

}

export const action: ActionFunction = async ({params, request}) => {
    const {player} = await authenticatePlayer(params, request);
    const formData = await request.formData();
    const gameId = formData.get("gameId")

    if (!player) {
        return redirect(routeLinks.games);
    }
    if (!gameId) {
        throw new Error("No GameId provided");
    }

    invariant(typeof gameId === 'string', "invalid gameId")
    const formValues: DashboardFormValues = getDashboardFormValues(formData, player.id, gameId)
    const {intent, profile, feedback, defaultFeedback} = formValues

    if (intent === "playerFeedback") {
        await updateFeedback(player.id, gameId, feedback.status, feedback.playerCount, feedback.note)
    } else if (intent === "playerProfile") {
        //     await updatePlayer(playerId, playerName.trim(), playerMail.trim());
//     await updateDefaultFeedback(playerId, feedbackStatus, playerCount, note)
    }


    // const {status, note, playerCount, gameId} = getFeedbackValues(formData);
    // if (!player) {
    //     return redirect(routeLinks.games);
    // }
    // if (formData.get("intent") === "defaultFeedback") {
    //     const newFeedback = await updateDefaultFeedback(
    //         player.id,
    //         status,
    //         playerCount,
    //         note
    //     );
    //     return json<ActionData>({
    //         defaultFeedback: newFeedback,
    //     });
    // } else if (formData.get("intent") === "feedback") {
    //     if (!gameId) {
    //         throw new Error("No GameId provided");
    //     }
    //     const newFeedback = await updateFeedback(
    //         player.id,
    //         gameId,
    //         status,
    //         playerCount,
    //         note
    //     );
    //     return json<ActionData>({gameFeedback: newFeedback});
    // }
    return json({})
};

export const loader: LoaderFunction = async ({params, request}) => {
    const {isAuthenticated, player} = await authenticatePlayer(params, request);
    if (!player) {
        return redirect(routeLinks.games);
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

    return (
        <Form method={"post"}>
            <input type={"hidden"} name={"gameId"} value={nextGame?.id}/>
            <PageHeader title={getPlayerGreeting(player.name)}/>
            <motion.div
                className={"flex flex-col gap-4"}
                variants={animationConfig.container}
                initial={"initial"}
                animate={"animate"}>
                <motion.div variants={animationConfig.animationItems}>
                    <GameSummary nextGame={nextGame}/>
                </motion.div>
                <motion.div variants={animationConfig.animationItems}>
                    <GameFeedback nextGame={nextGame}
                                  nextGameFeedback={nextGameFeedback}
                                  defaultFeedback={defaultFeedback}/>
                </motion.div>
                <motion.div variants={animationConfig.animationItems}>
                    <PlayerProfile player={player} defaultFeedback={defaultFeedback}/>
                </motion.div>
            </motion.div>
        </Form>
    );
};

export default Dashboard;
