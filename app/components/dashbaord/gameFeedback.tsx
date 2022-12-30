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

const GameFeedback = ({
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
            <input type={"hidden"} value={feedback.status} name={"dashboard.feedback.status"}/>
            <input type={"hidden"} value={feedback.playerCount} name={"dashboard.feedback.playerCount"}/>
            <input type={"hidden"} value={feedback.note ?? ''} name={"dashboard.feedback.note"}/>

            <PlayerFeedback playerFeedback={playerFeedbackOrDefault} onFeedbackChange={handleFeedBackChange}/>
            <ButtonContainer className={"flex justify-end my-2 md:my-5"}>
                <DefaultButton>
                    <button type={"submit"} name={"intent"} value={"playerFeedback"}>{messages.dashboard.saveFeedback}</button>
                </DefaultButton>
            </ButtonContainer>
        </ContentContainer>
    )
}

export default GameFeedback