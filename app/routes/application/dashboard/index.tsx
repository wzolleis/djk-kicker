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
import {NextGame} from "~/components/game/NextGame";
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
const Dashboard = () => {
    const {player, nextGame, nextGameFeedback, defaultFeedback} = useLoaderData() as unknown as LoaderData;
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
    const animationItems = {
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
            <PageHeader title={getPlayerGreeting(player.name)}/>
            <motion.div
                className={"flex flex-col gap-4"}
                variants={container}
                initial={"initial"}
                animate={"animate"}>
                <motion.div variants={animationItems}>
                    {nextGame &&
                        <ContentContainer className={"mt-2.5"}>
                            <Subheading title={`Nächstes Spiel: ${useDateTime(new Date(nextGame.gameTime))}`}/>
                            <div>
                                <ContentContainer className={"bg-blue-200"}>
                                    <PlayerCounter
                                        game={nextGame}
                                        calculate={calculateCompleteNumberOfPlayers}
                                        title={"Spieler insgesamt"}
                                        counterColor={"text-color-black"}
                                    />
                                    <GameFeedbackSummary game={nextGame}/>
                                </ContentContainer>
                            </div>
                        </ContentContainer>
                    }
                </motion.div>
                <motion.div variants={animationItems}>
                    {nextGame &&
                        <ContentContainer>
                            <Subheading
                                title={`Dein Status für das Spiel am ${useDate(new Date(nextGame.gameTime))}`}/>
                            <NextGame game={nextGame!}/>
                            {
                                !!nextGameFeedback && <PlayerFeedback playerFeedback={nextGameFeedback}/>
                            }
                        </ContentContainer>
                    }
                </motion.div>
                <motion.div variants={animationItems}>
                    <ContentContainer>
                        <Subheading title={"Dein Standard-Status"}/>
                        <DefaultFeedbackComponent
                            defaultFeedback={defaultFeedback}
                        />
                    </ContentContainer>
                </motion.div>
                <motion.div variants={animationItems}>
                    <ContentContainer>
                        <Subheading title={"Dein Profil"}/>
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
                </motion.div>
            </motion.div>
        </>
    );
};

export default Dashboard;
