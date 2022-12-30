import DashboardPlayerProfileForm, {
    DashboardPlayerProfileDescription
} from "~/components/player/profile/playerProfileForm";
import {ActionFunction, redirect} from "@remix-run/node";
import {authenticatePlayer} from "~/utils/session.server";
import routeLinks from "~/helpers/constants/routeLinks";
import {updateDefaultFeedback} from "~/models/feedback.server";
import {Form, useFetcher} from "@remix-run/react";
import {NavbarLoaderData} from "~/routes/application/navbar";
import {useEffect} from "react";
import messages from "~/components/i18n/messages";
import ContentContainer from "~/components/common/container/ContentContainer";
import ButtonContainer from "~/components/common/container/ButtonContainer";
import DefaultButton from "~/components/common/buttons/DefaultButton";
import invariant from "tiny-invariant";
import {updatePlayer} from "~/models/player.server";
import {istStatusInConfig, statusInConfig} from "~/config/status";
import {FormWrapper} from "~/utils/formWrapper.server";
import animationConfig from "~/config/animationConfig";
import {motion} from "framer-motion";


type ProfileFormInputName =
    | "dashboard.defaultFeedback.status" | "dashboard.defaultFeedback.playerCount" | "dashboard.defaultFeedback.note"
    | "dashboard.profile.player.name" | "dashboard.profile.player.email"

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
    const defaultFeedbackUpdate = await updateDefaultFeedback(playerId, defaultFeedbackStatusNumber, playerCountNumber, defaultFeedbackNote)

    return {
        player: playerUpdate,
        defaultFeedback: defaultFeedbackUpdate
    }
}

const PlayerProfile = () => {
    const fetcher = useFetcher<NavbarLoaderData>();

    useEffect(() => {
        fetcher.load('/application/navbar');
    }, []);


    if (fetcher.type !== "done") {
        return <div>{messages.app.loading}</div>
    }
    const player = fetcher.data?.player
    const defaultFeedback = fetcher.data?.defaultFeedback
    const nextGame = fetcher.data?.nextGame

    if (!player) {
        return <div>Kein Spieler</div>
    }

    return (
        <ContentContainer>
            <DashboardPlayerProfileDescription/>
            <Form method={"post"}>
                <ContentContainer className={"bg-blue-200 md:w-1/2"}>
                    <motion.div
                        className={"flex flex-col gap-4"}
                        variants={animationConfig.container}
                        initial={"initial"}
                        animate={"animate"}
                        exit={"exit"}
                    >
                        <motion.div variants={animationConfig.profileAnimationItems}>
                            <input type={"hidden"} name={"gameId"} value={nextGame?.id}/>
                            <DashboardPlayerProfileForm player={player} defaultFeedback={defaultFeedback}/>
                            <ButtonContainer className={"flex justify-end my-2 md:my-5"}>
                                <DefaultButton>
                                    <button type={"submit"} name={"intent"} value={"saveProfile"}>
                                        {messages.dashboard.saveProfile}
                                    </button>
                                </DefaultButton>
                                <DefaultButton>
                                    <button type={"submit"} name={"intent"} value={"deleteStatus"}>
                                        {messages.dashboard.saveProfile}
                                    </button>
                                </DefaultButton>
                            </ButtonContainer>
                        </motion.div>
                    </motion.div>
                </ContentContainer>
            </Form>
        </ContentContainer>
    )
}

export default PlayerProfile