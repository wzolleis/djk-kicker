import {authenticatePlayer} from "~/utils/session.server";
import {DefaultFeedback, Feedback, Player} from "@prisma/client";
import {ActionFunction, json, LoaderFunction, redirect,} from "@remix-run/node";
import {Form, useLoaderData} from "@remix-run/react";
import {getGameById, getMostRecentGame} from "~/models/games.server";
import {
    findFeedbackWithPlayerIdAndGameId,
    getDefaultFeedback,
    updateDefaultFeedback,
    updateFeedback,
} from "~/models/feedback.server";
import PageHeader from "~/components/common/PageHeader";
import {getPlayerGreeting, useDate, useDateTime} from "~/utils";
import ContentContainer from "~/components/common/container/ContentContainer";
import Subheading from "~/components/common/header/Subheading";
import {getFeedbackValues} from "~/utils/form.session";
import DefaultFeedbackComponent from "~/components/player/feedback/DefaultFeedbackComponent";
import {motion} from "framer-motion";
import PlayerFeedback from "~/components/player/feedback/PlayerFeedback";
import ButtonContainer from "~/components/common/container/ButtonContainer";
import DefaultButton from "~/components/common/buttons/DefaultButton";
import messages from "~/components/i18n/messages";
import EditProfile from "~/routes/application/dashboard/$playerId.profile.edit";
import routeLinks from "~/helpers/constants/routeLinks";
import {GameFeedbackSummary} from "~/components/game/GameSummary";
import {GameWithFeedback} from "~/config/gameTypes";
import PlayerCounter from "~/components/game/feedback/PlayerCounter";
import {calculateCompleteNumberOfPlayers} from "~/utils/playerCountHelper";
import animationConfig from "~/config/animationConfig";

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

export const action: ActionFunction = async ({params, request}) => {
    const {player} = await authenticatePlayer(params, request);
    const formData = await request.formData();
    const {status, note, playerCount, gameId} = getFeedbackValues(formData);
    if (!player) {
        return redirect(routeLinks.games);
    }
    if (formData.get("intent") === "defaultFeedback") {
        const newFeedback = await updateDefaultFeedback(
            player.id,
            status,
            playerCount,
            note
        );
        return json<ActionData>({
            defaultFeedback: newFeedback,
        });
    } else if (formData.get("intent") === "feedback") {
        if (!gameId) {
            throw new Error("No GameId provided");
        }
        const newFeedback = await updateFeedback(
            player.id,
            gameId,
            status,
            playerCount,
            note
        );
        return json<ActionData>({gameFeedback: newFeedback});
    }
};

export const loader: LoaderFunction = async ({params, request}) => {
    const {isAuthenticated, player} = await authenticatePlayer(
        params,
        request
    );
    if (!player) {
        return redirect(routeLinks.games);
    }
    const defaultFeedback = await getDefaultFeedback(player.id);
    const nextGame = await getMostRecentGame();
    const nextGameWithFeedBack = !!nextGame ? await getGameById(nextGame.id) : null
    const nextGameFeedback = await findFeedbackWithPlayerIdAndGameId(
        player?.id,
        nextGame!.id
    );

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
        <ContentContainer className={"mt-2.5"}>
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
                </ContentContainer>
            </div>
        </ContentContainer>
    )
}

const NextGameFeedback = ({
                              nextGame,
                              nextGameFeedback
                          }: { nextGame: GameWithFeedback | null, nextGameFeedback: Feedback | null }) => {
    if (!nextGame) return (
        <Subheading title={messages.errors.noGame}/>
    )

    return (
        <ContentContainer>
            <Subheading
                title={messages.dashboard.playerStatusForGame(useDate(new Date(nextGame.gameTime)))}/>
            <PlayerFeedback playerFeedback={nextGameFeedback}/>
        </ContentContainer>
    )
}

const PlayerProfile = ({player, defaultFeedback}: { player: Player, defaultFeedback: DefaultFeedback }) => {
    return (
        <>
            <ContentContainer>
                <Subheading title={messages.dashboard.playerDefaultStatus}/>
                <DefaultFeedbackComponent defaultFeedback={defaultFeedback}/>
            </ContentContainer>

            <ContentContainer>
                <Subheading title={messages.dashboard.playerProfile}/>
                <Form
                    action={`${player.id}/profile/edit`}
                    method={"post"}>
                    <EditProfile player={player}/>
                    <ButtonContainer className={"mt-2"}>
                        <DefaultButton className={"ml-auto"}>
                            <button type={"submit"}>{messages.buttons.save}</button>
                        </DefaultButton>
                    </ButtonContainer>
                </Form>
            </ContentContainer>
        </>
    )
}


const Dashboard = () => {
    const {player, nextGame, nextGameFeedback, defaultFeedback} = useLoaderData() as unknown as LoaderData;

    return (
        <>
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
                    <NextGameFeedback nextGame={nextGame} nextGameFeedback={nextGameFeedback}/>
                </motion.div>
                <motion.div variants={animationConfig.animationItems}>
                    <PlayerProfile player={player} defaultFeedback={defaultFeedback}/>
                </motion.div>
            </motion.div>
        </>
    );
};

export default Dashboard;
