import {DefaultFeedback, Game, Player} from "@prisma/client";
import {ActionFunction, json, LoaderFunction, redirect,} from "@remix-run/node";
import {Form, useLoaderData, useNavigation} from "@remix-run/react";
import invariant from "tiny-invariant";
import DefaultButton from "~/components/common/buttons/DefaultButton";
import RedButton from "~/components/common/buttons/RedButton";
import SubmitButton from "~/components/common/buttons/submitButton";
import ButtonContainer from "~/components/common/container/ButtonContainer";
import ContentContainer from "~/components/common/container/ContentContainer";
import TransitionContainer from "~/components/common/container/transitionContainer";
import Subheading from "~/components/common/header/Subheading";
import messages from "~/components/i18n/messages";
import PlayerProfileForm, {PlayerProfileDescription,} from "~/components/player/profile/playerProfileForm";
import routeLinks from "~/config/routeLinks";
import {istStatusInConfig, statusInConfig} from "~/config/status";
import {getDefaultFeedback, updateDefaultFeedback,} from "~/models/feedback.server";
import {getGameById, getMostRecentGame} from "~/models/games.server";
import {getPlayerById} from "~/models/player.server";
import {FormWrapper} from "~/utils/formWrapper.server";
import {authenticatePlayer} from "~/utils/session.server";

type LoaderData = {
    player: Player;
    game: Game;
    defaultFeedback: DefaultFeedback;
};

export const loader: LoaderFunction = async ({ params }) => {
    const playerid = params.playerId;
    invariant(!!playerid, "invalid playerid");
    const player = await getPlayerById(playerid);
    invariant(!!player, `player nicht gefunden, id = ${playerid}`);
    const nextGame = await getMostRecentGame();
    invariant(!!nextGame, "Kein Spiel");

    const nextGameWithFeedBack = await getGameById(nextGame.id);
    const defaultFeedback = await getDefaultFeedback(player.id);
    return json({ player, game: nextGameWithFeedBack, defaultFeedback });
};

const ProfileFormInputNameValues = [
    "dashboard.defaultFeedback.status",
    "dashboard.defaultFeedback.playerCount",
    "dashboard.defaultFeedback.note",
] as const;
export type ProfileFormInputName = (typeof ProfileFormInputNameValues)[number];

export const action: ActionFunction = async ({ request }) => {
    const { playerId } = await authenticatePlayer(request);
    const formData = await request.formData();
    const gameId = formData.get("gameId");
    const intent = formData.get("intent");

    if (!playerId) {
        return redirect(routeLinks.playerNotAuthenticated);
    }
    const player = await getPlayerById(playerId);

    if (!gameId) {
        throw new Error("No GameId provided");
    }
    if (!intent) {
        throw new Error("No intent provided");
    }

    invariant(typeof intent === "string", "invalid intent");

    if (intent === "saveProfile") {
        const profileForm = new FormWrapper<ProfileFormInputName>(formData);
        const defaultFeedbackStatus =
            profileForm.get("dashboard.defaultFeedback.status") ??
            `${statusInConfig.unknown}`;
        const defaultFeedbackPlayerCount =
            profileForm.get("dashboard.defaultFeedback.playerCount") ?? "0";
        const defaultFeedbackNote = profileForm.get(
            "dashboard.defaultFeedback.note"
        );

        invariant(
            typeof defaultFeedbackPlayerCount === "string",
            "invalid default_player_count type: " + defaultFeedbackPlayerCount
        );
        const playerCountNumber = Number.parseInt(defaultFeedbackPlayerCount);

        invariant(
            Number.isInteger(playerCountNumber),
            "invalid default_player_ count value" + defaultFeedbackPlayerCount
        );
        invariant(
            typeof defaultFeedbackStatus === "string",
            "invalid default_status type: " + defaultFeedbackStatus
        );
        invariant(
            typeof defaultFeedbackNote === "string",
            "invalid default_note type: " + defaultFeedbackNote
        );
        const defaultFeedbackStatusNumber = Number.parseInt(
            defaultFeedbackStatus
        );
        invariant(
            istStatusInConfig(defaultFeedbackStatusNumber),
            "invalid feedback_status value: " + defaultFeedbackStatusNumber
        );
        const defaultFeedbackUpdate = await updateDefaultFeedback({
            playerId,
            status: defaultFeedbackStatusNumber,
            playerCount: playerCountNumber,
            note: defaultFeedbackNote,
        });

        return json({
            player,
            defaultFeedback: defaultFeedbackUpdate,
        });
    } else if (intent === "resetProfile") {
        const defaultFeedbackUpdate = await updateDefaultFeedback({
            playerId,
            status: statusInConfig.unknown,
            playerCount: 0,
            note: undefined,
        });
        // das hat leider keine Auswirkung auf das Formular - known bug :(
        return json({ player, defaultFeedback: defaultFeedbackUpdate });
    } else {
        throw new Error(`invalid intent provided: ${intent}`);
    }
};

const ProcessingPlaceholder = ({ hidden }: { hidden: boolean }) => {
    if (hidden) return null;
    return (
        <div className={"flex flex-col items-center"}>
            <Subheading title={messages.app.process} />
        </div>
    );
};

const PlayerProfile = () => {
    const {
        player,
        defaultFeedback,
        game: nextGame,
    } = useLoaderData<LoaderData>();
    const transition = useNavigation();
    let activeTransition = transition.state !== "idle";
    if (!player) {
        return (
            <div
                className={
                    "rounded-xl bg-red-100 p-3 ring-1 ring-red-200"
                }>
                <p
                    className={
                        "font-default-regular text-label-medium text-red-800"
                    }>
                    {messages.warnings.noPlayer}
                </p>
            </div>
        );
    }

    return (
        <TransitionContainer>
            <ContentContainer key="profile">
                <PlayerProfileDescription />
                <Form method={"post"}>
                    <fieldset disabled={activeTransition}>
                        <ContentContainer className={"bg-blue-200"}>
                            <input
                                type={"hidden"}
                                name={"gameId"}
                                value={nextGame?.id}
                            />
                            <PlayerProfileForm
                                player={player}
                                defaultFeedback={defaultFeedback}
                            />
                            <ProcessingPlaceholder hidden={!activeTransition} />
                            {!activeTransition && (
                                <ButtonContainer
                                    className={
                                        "my-2 flex justify-start md:my-5"
                                    }>
                                    <RedButton>
                                        <SubmitButton
                                            label={messages.buttons.reset}
                                            name="intent"
                                            value="resetProfile"
                                            showTransitionSpinner={true}
                                        />
                                    </RedButton>
                                    <DefaultButton className={"ml-auto"}>
                                        <SubmitButton
                                            label={
                                                messages.dashboard.saveProfile
                                            }
                                            name="intent"
                                            value="saveProfile"
                                            showTransitionSpinner={true}
                                        />
                                    </DefaultButton>
                                </ButtonContainer>
                            )}
                        </ContentContainer>
                    </fieldset>
                </Form>
            </ContentContainer>
        </TransitionContainer>
    );
};

export default PlayerProfile;
