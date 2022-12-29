import {authenticatePlayer} from "~/utils/session.server";
import {DefaultFeedback, Feedback, Player} from "@prisma/client";
import {ActionFunction, json, LoaderFunction, redirect,} from "@remix-run/node";
import {Form, useActionData, useLoaderData} from "@remix-run/react";
import {getGameById, getMostRecentGame} from "~/models/games.server";
import {
    findFeedbackWithPlayerIdAndGameId,
    getDefaultFeedback,
    updateDefaultFeedback,
    updateFeedback,
} from "~/models/feedback.server";
import PageHeader from "~/components/common/PageHeader";
import {getPlayerGreeting} from "~/utils";
import {AnimatePresence, motion} from "framer-motion";
import routeLinks from "~/helpers/constants/routeLinks";
import {GameWithFeedback} from "~/config/gameTypes";
import animationConfig from "~/config/animationConfig";
import invariant from "tiny-invariant";
import GameFeedback from "~/components/dashbaord/gameFeedback";
import GameSummary from "~/components/dashbaord/gameSummary";
import DashboardPlayerProfileForm, {DashboardPlayerProfileDescription} from "~/components/dashbaord/playerProfileForm";
import {updatePlayer} from "~/models/player.server";
import {DashboardFormValues, getDashboardFormValues} from "~/components/dashbaord/dashboardHelper";
import _ from "lodash";
import {useState} from "react";
import DefaultButton from "~/components/common/buttons/DefaultButton";
import ButtonContainer from "~/components/common/container/ButtonContainer";
import messages from "~/components/i18n/messages";
import RedButton from "~/components/common/buttons/RedButton";
import ContentContainer from "~/components/common/container/ContentContainer";

type LoaderData = {
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
        return redirect(routeLinks.games);
    }
    if (!gameId) {
        throw new Error("No GameId provided");
    }

    const playerId = player.id

    invariant(typeof gameId === 'string', "invalid gameId")
    const formValues: DashboardFormValues = getDashboardFormValues(formData, player.id, gameId)
    const {intent, profile, feedback, defaultFeedback} = formValues

    if (intent === "playerFeedback") {
        const feedbackUpdate = await updateFeedback(player.id, gameId, feedback.status, feedback.playerCount, feedback.note)
        return json<ActionData>({
            gameFeedback: feedbackUpdate
        })
    } else if (intent === "playerProfile") {
        const {name, email} = profile
        const {status, playerCount, note} = defaultFeedback
        const playerUpdate = await updatePlayer(playerId, name.trim(), email.trim());
        const defaultFeedbackUpdate = await updateDefaultFeedback(playerId, status, playerCount, note)
        return json<ActionData>({
            player: playerUpdate,
            defaultFeedback: defaultFeedbackUpdate
        })
    }
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
    const actionData = useActionData<ActionData>()
    const [showEditProfile, setShowEditProfile] = useState<boolean>(false)
    const playerWithUpdate: Player = _.merge(player, actionData?.player)
    const feedbackWithUpdate: Feedback = _.merge(nextGameFeedback, actionData?.gameFeedback)
    const defaultFeedbackWithUpdate: DefaultFeedback = _.merge(defaultFeedback, actionData?.defaultFeedback)

    const profileViewItems = [
        {
            id: "editProfile",
            showEditProfile: true
        },
        {
            id: "showProfileDescription",
            showEditProfile: false
        }
    ]

    return (
        <>
            <Form method={"post"}>
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
                    <ContentContainer className={"shadow-lg shadow-indigo-500/50"}>
                        <AnimatePresence>
                            <motion.div key={"editProfile"} variants={animationConfig.profileAnimationItems}>
                                {showEditProfile &&
                                    <DashboardPlayerProfileForm player={playerWithUpdate}
                                                                defaultFeedback={defaultFeedbackWithUpdate}
                                    />
                                }
                            </motion.div>
                            <motion.div key={"showProfileDescription"} variants={animationConfig.profileAnimationItems}>
                                {!showEditProfile && <DashboardPlayerProfileDescription/>}
                            </motion.div>
                        </AnimatePresence>
                        <ButtonContainer className={"flex justify-end my-2 md:my-5"}>
                            <DefaultButton className={`ml-auto ${!showEditProfile ? '' : 'hidden'}`}>
                                <button type={"button"} onClick={() => setShowEditProfile(!showEditProfile)}>
                                    {messages.dashboard.showProfile}
                                </button>
                            </DefaultButton>
                            <RedButton className={`ml-auto ${showEditProfile ? '' : 'hidden'}`}>
                                <button type={"button"} onClick={() => setShowEditProfile(!showEditProfile)}>
                                    {messages.buttons.cancel}
                                </button>
                            </RedButton>
                            <DefaultButton className={`${showEditProfile ? '' : 'hidden'}`}>
                                <button type={"submit"} name={"intent"}
                                        value={"playerProfile"}
                                        onClick={() => setShowEditProfile(!showEditProfile)}
                                >
                                    {messages.dashboard.saveProfile}
                                </button>
                            </DefaultButton>
                        </ButtonContainer>
                    </ContentContainer>
                </motion.div>
            </Form>
        </>
    )
        ;
};

export default Dashboard;
