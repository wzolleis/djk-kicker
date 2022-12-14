import PlayerProfileForm, {PlayerProfileDescription} from "~/components/player/profile/playerProfileForm";
import {ActionFunction, json, LoaderFunction, redirect} from "@remix-run/node";
import {authenticatePlayer} from "~/utils/session.server";
import routeLinks from "~/config/routeLinks";
import {getDefaultFeedback, updateDefaultFeedback} from "~/models/feedback.server";
import {Form, useLoaderData, useTransition} from "@remix-run/react";
import messages from "~/components/i18n/messages";
import ContentContainer from "~/components/common/container/ContentContainer";
import ButtonContainer from "~/components/common/container/ButtonContainer";
import DefaultButton from "~/components/common/buttons/DefaultButton";
import invariant from "tiny-invariant";
import {getPlayerById, updatePlayer} from "~/models/player.server";
import {istStatusInConfig, statusInConfig} from "~/config/status";
import {FormWrapper} from "~/utils/formWrapper.server";
import SubmitButton from "~/components/common/buttons/submitButton";
import RedButton from "~/components/common/buttons/RedButton";
import {DefaultFeedback, Game, Player} from "@prisma/client";
import {getGameById, getMostRecentGame} from "~/models/games.server";
import Subheading from "~/components/common/header/Subheading";
import TransitionContainer from "~/components/common/container/transitionContainer";

type LoaderData = {
    player: Player
    game: Game
    defaultFeedback: DefaultFeedback
};

export const loader: LoaderFunction = async ({params}) => {
    const playerid = params.playerId
    invariant(!!playerid, "invalid playerid")
    const player = await getPlayerById(playerid)
    invariant(!!player, `player nicht gefunden, id = ${playerid}`)
    const nextGame = await getMostRecentGame();
    invariant(!!nextGame, "Kein Spiel")

    const nextGameWithFeedBack = await getGameById(nextGame.id)
    const defaultFeedback = await getDefaultFeedback(player.id)
    return json({player, game: nextGameWithFeedBack, defaultFeedback});
};

const ProfileFormInputNameValues = [
    "dashboard.defaultFeedback.status", "dashboard.defaultFeedback.playerCount",
    "dashboard.defaultFeedback.note", "dashboard.profile.player.name", "dashboard.profile.player.email"] as const
export type ProfileFormInputName = typeof ProfileFormInputNameValues[number]

export const action: ActionFunction = async ({ request}) => {
    const {player} = await authenticatePlayer(request);
    const formData = await request.formData();
    const gameId = formData.get("gameId")
    const intent = formData.get("intent")

    if (!player) {
        return redirect(routeLinks.playerNotAuthenticated);
    }
    if (!gameId) {
        throw new Error("No GameId provided");
    }
    if (!intent) {
        throw new Error("No intent provided");
    }

    invariant(typeof intent === "string", "invalid intent")
    const playerId = player.id

    if (intent === "saveProfile") {
        const profileForm = new FormWrapper<ProfileFormInputName>(formData)
        const playerName = profileForm.get("dashboard.profile.player.name")
        const playerMail = profileForm.get("dashboard.profile.player.email")
        const defaultFeedbackStatus = profileForm.get("dashboard.defaultFeedback.status") ?? `${statusInConfig.unknown}`
        const defaultFeedbackPlayerCount = profileForm.get("dashboard.defaultFeedback.playerCount") ?? "0"
        const defaultFeedbackNote = profileForm.get("dashboard.defaultFeedback.note")

        invariant(typeof defaultFeedbackPlayerCount === 'string', "invalid default_player_count type: " + defaultFeedbackPlayerCount)
        const playerCountNumber = Number.parseInt(defaultFeedbackPlayerCount)

        invariant(Number.isInteger(playerCountNumber), "invalid default_player_ count value" + defaultFeedbackPlayerCount)
        invariant(typeof defaultFeedbackStatus === 'string', "invalid default_status type: " + defaultFeedbackStatus)
        invariant(typeof defaultFeedbackNote === 'string', "invalid default_note type: " + defaultFeedbackNote)
        invariant(typeof playerName === 'string', "invalid player name type: " + playerName)
        invariant(typeof playerMail === 'string', "invalid player mail type: " + playerMail)
        const defaultFeedbackStatusNumber = Number.parseInt(defaultFeedbackStatus)
        invariant(istStatusInConfig(defaultFeedbackStatusNumber), "invalid feedback_status value: " + defaultFeedbackStatusNumber)
        const playerUpdate = await updatePlayer(playerId, playerName.trim(), playerMail.trim());
        const defaultFeedbackUpdate = await updateDefaultFeedback(
            {
                playerId, status: defaultFeedbackStatusNumber, playerCount: playerCountNumber, note: defaultFeedbackNote
            })


        return json({
            player: playerUpdate,
            defaultFeedback: defaultFeedbackUpdate
        })
    } else if (intent === "resetProfile") {
        const defaultFeedbackUpdate = await updateDefaultFeedback(
            {
                playerId,
                status: statusInConfig.unknown,
                playerCount: 0,
                note: undefined
            })
        // das hat leider keine Auswirkung auf das Formular - known bug :(
        return json({player, defaultFeedback: defaultFeedbackUpdate})
    } else {
        throw new Error(`invalid intent provided: ${intent}`);
    }
}

const ProcessingPlaceholder = ({hidden}: { hidden: boolean }) => {
    if (hidden) return null
    return (
        <div className={"flex flex-col items-center"}>
            <Subheading title={messages.app.process}/>
        </div>
    )
}

const PlayerProfile = () => {
    const {player, defaultFeedback, game: nextGame} = useLoaderData<LoaderData>()
    const transition = useTransition()
    let activeTransition = transition.state !== "idle"
    if (!player) {
        return (
            <div className={"bg-red-100 rounded-xl p-3 ring ring-1 ring-red-200"}>
                <p className={"font-default-regular text-label-medium text-red-800"}>{messages.warnings.noPlayer}</p>
            </div>
        )
    }

    return (
        <TransitionContainer>
            <ContentContainer key="profile">
                <PlayerProfileDescription/>
                <Form method={"post"}>
                    <fieldset disabled={activeTransition}>
                        <ContentContainer className={"bg-blue-200"}>
                            <input type={"hidden"} name={"gameId"} value={nextGame?.id}/>
                            <PlayerProfileForm player={player} defaultFeedback={defaultFeedback}/>
                            <ProcessingPlaceholder hidden={!activeTransition}/>
                            {!activeTransition && <ButtonContainer className={"flex justify-start my-2 md:my-5"}>
                                <RedButton>
                                    <SubmitButton label={messages.buttons.reset}
                                                  name="intent"
                                                  value="resetProfile"
                                                  showTransitionSpinner={true}
                                    />
                                </RedButton>
                                <DefaultButton className={"ml-auto"}>
                                    <SubmitButton label={messages.dashboard.saveProfile}
                                                  name="intent"
                                                  value="saveProfile"
                                                  showTransitionSpinner={true}
                                    />
                                </DefaultButton>
                            </ButtonContainer>
                            }
                        </ContentContainer>
                    </fieldset>
                </Form>
            </ContentContainer>
        </TransitionContainer>
    )
}

export default PlayerProfile