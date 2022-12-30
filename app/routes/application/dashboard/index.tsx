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

    const playerId = player.id

    invariant(typeof gameId === 'string', "invalid gameId")
    const formValues: DashboardFormValues = getDashboardFormValues(formData, player.id, gameId)
    const {intent, profile, feedback, defaultFeedback} = formValues

    if (intent === "playerFeedback") {
        invariant(!!feedback, "Feedback is undefined")
        const feedbackUpdate = await updateFeedback(player.id, gameId, feedback.status, feedback.playerCount, feedback.note)
        return json<ActionData>({
            gameFeedback: feedbackUpdate
        })
    } else if (intent === "playerProfile") {
        invariant(!!profile, "Profile is undefined")
        invariant(!!defaultFeedback, "DefaultFeedback is undefined")
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

    const [showEditProfile, setShowEditProfile] = useState<boolean>(false)
    const playerWithUpdate: Player = _.merge(player, actionData?.player)
    const feedbackWithUpdate: Feedback = _.merge(nextGameFeedback, actionData?.gameFeedback)
    const defaultFeedbackWithUpdate: DefaultFeedback = _.merge(defaultFeedback, actionData?.defaultFeedback)

    const toggleShowEditProfile = () => setShowEditProfile(!showEditProfile)

    const profileViewItems = [
        {
            id: "editProfile",
            showEditProfile: true,
            component: <DashboardPlayerProfileForm player={player} defaultFeedback={defaultFeedback}/>
        },
        {
            id: "showProfileDescription",
            showEditProfile: false,
            component:
                <DashboardPlayerProfileDescription/>
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
                            {
                                profileViewItems
                                    .filter((item) => item.showEditProfile === showEditProfile)
                                    .map(item =>
                                        <motion.div key={item.id} variants={animationConfig.profileAnimationItems}>
                                            {item.component}
                                        </motion.div>
                                    )
                            }
                        </AnimatePresence>
                        <ButtonContainer className={"flex justify-end my-2 md:my-5"}>
                            <DefaultButton className={`ml-auto bg-grey-500 ${!showEditProfile ? '' : 'hidden'}`}>
                                <button type={"button"} onClick={toggleShowEditProfile}>
                                    {messages.dashboard.showProfile}
                                </button>
                            </DefaultButton>
                            <RedButton className={`ml-auto ${showEditProfile ? '' : 'hidden'}`}>
                                <button type={"button"} onClick={toggleShowEditProfile}>
                                    {messages.buttons.cancel}
                                </button>
                            </RedButton>
                            <DefaultButton className={`${showEditProfile ? '' : 'hidden'}`}>
                                <button type={"submit"}
                                        name={"intent"}
                                        value={"playerProfile"}
                                        onClick={toggleShowEditProfile}
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
};

export default Dashboard;
