import {GameWithFeedback} from "~/config/gameTypes";
import {DefaultFeedback, Feedback} from "@prisma/client";
import Subheading from "~/components/common/header/Subheading";
import messages from "~/components/i18n/messages";
import {useState} from "react";
import ContentContainer from "~/components/common/container/ContentContainer";
import {useDate} from "~/utils";
import PlayerFeedback from "~/components/player/feedback/PlayerFeedback";
import ButtonContainer from "~/components/common/container/ButtonContainer";
import DefaultButton from "~/components/common/buttons/DefaultButton";
import {useTransition} from "@remix-run/react";
import classNames from "classnames";
import SubmitButton from "~/components/common/buttons/submitButton";

const GameFeedback = ({
                          nextGame,
                          nextGameFeedback,
                          defaultFeedback
                      }: { nextGame: GameWithFeedback | null, nextGameFeedback: Feedback | null, defaultFeedback: DefaultFeedback }) => {
    const transition = useTransition()

    if (!nextGame) return (
        <Subheading title={messages.errors.noGame}/>
    )
    const playerFeedbackOrDefault: Feedback = nextGameFeedback ?? {gameId: nextGame.id, ...defaultFeedback}
    const [feedback, setFeedBack] = useState<Feedback>(playerFeedbackOrDefault)

    const handleFeedBackChange = (changedFeedback: Feedback) => {
        setFeedBack(changedFeedback)
    }
    const submitting = transition.state === "submitting"
    const loading = transition.state === "loading"

    let title = ''
    switch (transition.state) {
        default:
        case "idle":
            title = messages.dashboard.playerStatusForGame(useDate(new Date(nextGame.gameTime)))
            break
        case "loading":
            title = messages.app.loading
            break
        case "submitting":
            title = messages.app.saving
            break
    }

    return (
        <ContentContainer className={"mt-2.5 shadow-lg shadow-blue-400/50"}>
            <Subheading title={title}/>
            <ContentContainer
                className={classNames(loading || submitting ? "opacity-25" : "opacity-100", "bg-blue-200")}>
                <input type={"hidden"} value={feedback.status} name={"dashboard.feedback.status"}/>
                <input type={"hidden"} value={feedback.playerCount} name={"dashboard.feedback.playerCount"}/>
                <input type={"hidden"} value={feedback.note ?? ''} name={"dashboard.feedback.note"}/>

                <PlayerFeedback playerFeedback={playerFeedbackOrDefault} onFeedbackChange={handleFeedBackChange}/>
                <ButtonContainer className={"flex justify-end my-2 md:my-5"}>
                    <DefaultButton>
                        <SubmitButton idleLabel={messages.buttons.save}
                                      name="intent"
                                      value="playerFeedback"
                        />
                    </DefaultButton>
                </ButtonContainer>
            </ContentContainer>
        </ContentContainer>
    )
}

export default GameFeedback