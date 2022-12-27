import {Feedback} from "@prisma/client";
import {PlayerStatus} from "~/components/player/feedback/PlayerStatus";
import TextAreaWithLabel from "~/components/common/form/TextareaWithLabel";
import {useState} from "react";
import messages from "~/components/i18n/messages";
import {PlayerCount} from "~/components/common/counter/PlayerCount";
import ContentContainer from "~/components/common/container/ContentContainer";
import {motion} from "framer-motion";
import playerCountHelper from "~/utils/playerCountHelper";
import animationConfig from "~/config/animationConfig";

type PlayerFeedbackProps = {
    playerFeedback: Feedback;

    onFeedbackChange: (feedBack: Feedback) => void
};

const PlayerFeedback = ({playerFeedback, onFeedbackChange}: PlayerFeedbackProps) => {
    const [feedbackStatus, setFeedbackStatus] = useState<number>(playerFeedback.status);
    const [playerCount, setPlayerCount] = useState<number>(playerFeedback.playerCount);
    const [playerNote, setPlayerNote] = useState<string>(playerFeedback.note ?? '')

    const getActualFeedback = (): Feedback => {
        return {
            ...playerFeedback,
            playerCount,
            status: feedbackStatus,
            note: playerNote
        }

    }

    const onPlayerNoteChange = (note: string) => {
        setPlayerNote(note)
        onFeedbackChange({
            ...getActualFeedback(),
            note
        })
    }

    const onStatusChange = (status: number) => {
        setFeedbackStatus(status)
        onFeedbackChange({
            ...getActualFeedback(),
            status,
        })
    }

    const onAdd = () => {
        const newPlayerCount = playerCountHelper.add(playerCount)
        setPlayerCount(newPlayerCount)
        onFeedbackChange({
            ...getActualFeedback(),
            playerCount: newPlayerCount,
        })
    }

    const onSubtract = () => {
        const newPlayerCount = playerCountHelper.subtract(playerCount)
        setPlayerCount(newPlayerCount)
        onFeedbackChange({
            ...getActualFeedback(),
            playerCount: newPlayerCount,
        })
    }

    return (
        <>
            <motion.div variants={animationConfig.container}
                        initial={"initial"}
                        animate={"animate"}
                        className={"flex flex-col gap-3"}>
                <p className={"font-default-medium text-gray-600 mt-2"}>
                    {messages.game.feedback.headings.feedback}
                </p>
                <motion.div variants={animationConfig.animationItems}>
                    <ContentContainer>
                        <PlayerStatus status={feedbackStatus} setStatus={onStatusChange}/>
                    </ContentContainer>
                </motion.div>
                <motion.div variants={animationConfig.animationItems}>
                    <p className={"font-default-medium text-gray-600"}>
                        {messages.game.feedback.headings.playerCount}
                    </p>
                    <ContentContainer>
                        <PlayerCount playerCount={playerCount}
                                     onAdd={onAdd}
                                     onSubtract={onSubtract}
                        />
                    </ContentContainer>
                </motion.div>
                <motion.div variants={animationConfig.animationItems}>
                    <TextAreaWithLabel
                        id={"player.note"}
                        name={"player.note"}
                        label={messages.game.feedback.headings.note}
                        defaultValue={playerNote}
                        onChange={onPlayerNoteChange}
                    />
                </motion.div>
            </motion.div>
        </>
    );
};

export default PlayerFeedback;
