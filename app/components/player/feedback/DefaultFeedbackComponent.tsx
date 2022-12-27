import {DefaultFeedback} from "@prisma/client";
import {PlayerStatus} from "~/components/player/feedback/PlayerStatus";
import TextAreaWithLabel from "~/components/common/form/TextareaWithLabel";
import {useState} from "react";
import messages from "~/components/i18n/messages";
import {PlayerCount} from "~/components/common/counter/PlayerCount";
import ContentContainer from "~/components/common/container/ContentContainer";
import playerCountHelper from "~/utils/playerCountHelper";

type DefaultFeedbackProps = {
    defaultFeedback: DefaultFeedback;
    title: string
};

const DefaultFeedbackComponent = ({defaultFeedback, title}: DefaultFeedbackProps) => {
    const [feedbackStatus, setFeedbackStatus] = useState<number>(defaultFeedback.status);
    const [playerCount, setPlayerCount] = useState(defaultFeedback.playerCount);

    const onAdd = () => {
        setPlayerCount(playerCountHelper.add(playerCount))
    }
    const onSubtract = () => {
        setPlayerCount(playerCountHelper.subtract(playerCount))
    }

    return (
        <>
            <p className={"font-default-medium text-gray-600"}>{title}</p>
            <ContentContainer>
                <input type={"hidden"} value={feedbackStatus } name={"defaultFeedback.feedbackStatus"}/>
                <PlayerStatus status={feedbackStatus} setStatus={setFeedbackStatus}/>
            </ContentContainer>
            <p className={"font-default-medium text-gray-600"}>{messages.game.feedback.headings.playerCount}</p>
            <ContentContainer>
                <input type={"hidden"} value={playerCount } name={"defaultFeedback.playerCount"}/>
                <PlayerCount playerCount={playerCount} onAdd={onAdd} onSubtract={onSubtract}></PlayerCount>
            </ContentContainer>
            <TextAreaWithLabel
                id={"defaultFeedback.note"}
                name={"defaultFeedback.note"}
                label={messages.game.feedback.headings.note}
                defaultValue={defaultFeedback?.note ?? ''}
            />
        </>
    );
};

export default DefaultFeedbackComponent;
