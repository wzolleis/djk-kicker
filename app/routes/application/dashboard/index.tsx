import {authenticatePlayer} from "~/utils/session.server";
import {DefaultFeedback, Feedback, Player} from "@prisma/client";
import {ActionFunction, json, LoaderFunction, redirect,} from "@remix-run/node";
import {Form, useLoaderData} from "@remix-run/react";
import {getGameById, getMostRecentGame} from "~/models/games.server";
import {findFeedbackWithPlayerIdAndGameId, getDefaultFeedback, updateFeedback,} from "~/models/feedback.server";
import PageHeader from "~/components/common/PageHeader";
import {getPlayerGreeting, useDate, useDateTime} from "~/utils";
import ContentContainer from "~/components/common/container/ContentContainer";
import Subheading from "~/components/common/header/Subheading";
import DefaultFeedbackComponent from "~/components/player/feedback/DefaultFeedbackComponent";
import {motion} from "framer-motion";
import PlayerFeedback from "~/components/player/feedback/PlayerFeedback";
import playerFeedback from "~/components/player/feedback/PlayerFeedback";
import DefaultButton from "~/components/common/buttons/DefaultButton";
import messages from "~/components/i18n/messages";
import EditProfile from "~/routes/application/dashboard/$playerId.profile.edit";
import routeLinks from "~/helpers/constants/routeLinks";
import {GameFeedbackSummary} from "~/components/game/GameSummary";
import {GameWithFeedback} from "~/config/gameTypes";
import PlayerCounter from "~/components/game/feedback/PlayerCounter";
import {calculateCompleteNumberOfPlayers} from "~/utils/playerCountHelper";
import animationConfig from "~/config/animationConfig";
import ButtonContainer from "~/components/common/container/ButtonContainer";
import {useState} from "react";
import invariant from "tiny-invariant";

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

type FeedbackFormValues = Omit<Feedback, "id">

const getPlayerFeedBack = (formData: FormData, playerId: string, gameId: string): FeedbackFormValues => {
    const status = formData.get("dashboard.player.feedbackStatus")
    const playerCount = formData.get("dashboard.player.playerCount") ?? 0
    const note = formData.get("dashboard.player.note")

    invariant(typeof playerCount === 'string', "invalid player count value: " + playerCount)
    invariant(typeof status === 'string', "invalid status value: " + status)
    invariant(typeof note === 'string', "invalid note value: " + note)


    return {
        status: Number.parseInt(status),
        note,
        playerCount: Number.parseInt(playerCount),
        gameId,
        playerId
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
    const feedBack: FeedbackFormValues = getPlayerFeedBack(formData, player.id, gameId)

    await updateFeedback(player.id, gameId, feedBack.status, feedBack.playerCount, feedBack.note)

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

const NextGameSummary = ({nextGame}: { nextGame: GameWithFeedback | null }) => {
    if (!nextGame) return (
        <Subheading title={messages.errors.noGame}/>
    )

    return (
        <ContentContainer className={"mt-2.5 shadow-lg shadow-blue-400/50"}>
            <Subheading title={`${messages.dashboard.nextGame}: ${useDateTime(new Date(nextGame.gameTime))}`}/>
            <div>
                <ContentContainer className="bg-blue-200">
                    <PlayerCounter
                        game={nextGame}
                        calculate={calculateCompleteNumberOfPlayers}
                        title={messages.dashboard.playerAndGuests}
                        counterColor={"text-color-black"}
                    />
                    <GameFeedbackSummary game={nextGame}/>
                    <div className={"flex justify-end mt-3"}>
                        <DefaultButton>
                            <button type={"button"}>{messages.buttons.details}</button>
                            <p className={"fa fa-arrow-circle-right"}/>
                        </DefaultButton>
                    </div>
                </ContentContainer>
            </div>
        </ContentContainer>
    )
}

const PlayerProfile = ({player, defaultFeedback}: { player: Player, defaultFeedback: DefaultFeedback }) => {
    return (
        <ContentContainer className={"shadow-lg shadow-indigo-500/50"}>
            <Subheading title={messages.dashboard.playerProfile}/>
            <EditProfile player={player}/>
            <hr className="my-8 h-px bg-gray-400 border-0"/>
            <DefaultFeedbackComponent defaultFeedback={defaultFeedback}
                                      title={messages.dashboard.playerDefaultStatus}
            />
            <ButtonContainer className={"flex justify-end my-2 md:my-5"}>
                <DefaultButton className={"ml-auto"}>
                    <button type={"submit"} name={"intent"} value={"playerProfile"}>{messages.buttons.save}</button>
                </DefaultButton>
            </ButtonContainer>
        </ContentContainer>
    )
}

const NextGameFeedback = ({
                              nextGame,
                              nextGameFeedback,
                              defaultFeedback
                          }: { nextGame: GameWithFeedback | null, nextGameFeedback: Feedback | null, defaultFeedback: DefaultFeedback }) => {
    if (!nextGame) return (
        <Subheading title={messages.errors.noGame}/>
    )
    const playerFeedbackOrDefault: Feedback = nextGameFeedback ?? {gameId: nextGame.id, ...defaultFeedback}
    const [feedback, setFeedBack] = useState<Feedback>(playerFeedbackOrDefault)

    const handleFeedBackChange = (changedFeedback: Feedback) => {
        setFeedBack(changedFeedback)
    }

    return (
        <ContentContainer className={"shadow-lg shadow-indigo-500/50"}>
            <Subheading
                title={messages.dashboard.playerStatusForGame(useDate(new Date(nextGame.gameTime)))}/>
            <input type={"hidden"} value={feedback.status} name={"dashboard.player.feedbackStatus"}/>
            <input type={"hidden"} value={feedback.playerCount} name={"dashboard.player.playerCount"}/>
            <input type={"hidden"} value={feedback.note ?? ''} name={"dashboard.player.note"}/>

            <PlayerFeedback playerFeedback={playerFeedbackOrDefault} onFeedbackChange={handleFeedBackChange}/>
            <ButtonContainer className={"flex justify-end my-2 md:my-5"}>
                <DefaultButton>
                    <button type={"submit"} name={"intent"} value={"playerFeedback"}>{messages.buttons.save}</button>
                </DefaultButton>
            </ButtonContainer>
        </ContentContainer>
    )
}


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
                    <NextGameSummary nextGame={nextGame}/>
                </motion.div>
                <motion.div variants={animationConfig.animationItems}>
                    <NextGameFeedback nextGame={nextGame} nextGameFeedback={nextGameFeedback}
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
