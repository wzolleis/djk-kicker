import {DefaultFeedback} from "@prisma/client";
import TextAreaWithLabel from "~/components/common/form/TextareaWithLabel";
import React, {useState} from "react";
import messages from "~/components/i18n/messages";
import {PlayerCount} from "~/components/common/counter/PlayerCount";
import ContentContainer from "~/components/common/container/ContentContainer";
import playerCountHelper from "~/utils/playerCountHelper";
import {statusInConfig} from "~/config/status";
import {DefaultPlayerStatus} from "~/components/player/feedback/DefaultPlayerStatus";

type DefaultFeedbackProps = {
    defaultFeedback: DefaultFeedback | undefined;
    title: string
};

const DefaultFeedbackComponent = ({defaultFeedback, title}: DefaultFeedbackProps) => {
    const [feedbackStatus, setFeedbackStatus] = useState<number>(defaultFeedback?.status ?? statusInConfig.unknown);
    const [playerCount, setPlayerCount] = useState(defaultFeedback?.playerCount ?? 0);

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
                <input type={"hidden"} value={feedbackStatus} name={"dashboard.defaultFeedback.status"}/>
                <DefaultPlayerStatus status={feedbackStatus} setStatus={setFeedbackStatus}/>
            </ContentContainer>
            <p className={"font-default-medium text-gray-600"}>{messages.game.feedback.headings.playerCount}</p>
            <ContentContainer>
                <input type={"hidden"} value={playerCount} name={"dashboard.defaultFeedback.playerCount"}/>
                <PlayerCount playerCount={playerCount} onAdd={onAdd} onSubtract={onSubtract}></PlayerCount>
            </ContentContainer>
            <TextAreaWithLabel
                id={"defaultFeedback.note"}
                name={"dashboard.defaultFeedback.note"}
                label={messages.game.feedback.headings.note}
                defaultValue={defaultFeedback?.note ?? ''}
            />
        </>
    );
};

export default DefaultFeedbackComponent;
