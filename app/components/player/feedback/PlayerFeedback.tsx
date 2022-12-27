import {Feedback} from "@prisma/client";
import {PlayerStatus} from "~/components/player/feedback/PlayerStatus";
import TextAreaWithLabel from "~/components/common/form/TextareaWithLabel";
import {useEffect, useState} from "react";
import {useFetcher} from "@remix-run/react";
import DefaultButton from "~/components/common/buttons/DefaultButton";
import messages from "~/components/i18n/messages";
import {PlayerCount} from "~/components/common/counter/PlayerCount";
import ContentContainer from "~/components/common/container/ContentContainer";
import {motion} from "framer-motion";
import playerCountHelper from "~/utils/playerCountHelper";
import routeLinks from "~/helpers/constants/routeLinks";
import {configuration} from "~/config";
import animationConfig from "~/config/animationConfig";

type PlayerFeedbackProps = {
    playerFeedback: Feedback | null;
};

const PlayerFeedback = ({playerFeedback}: PlayerFeedbackProps) => {
    const [feedbackStatus, setFeedbackStatus] = useState<number>(playerFeedback?.status ?? configuration.status.unknown);
    const [note, setNote] = useState<string>(playerFeedback?.note || "");
    const [playerCount, setPlayerCount] = useState<number>(playerFeedback?.playerCount ?? 0);
    const fetcher = useFetcher();
    useEffect(() => {
        if (fetcher.data?.defaultFeedback) {
            setFeedbackStatus(parseInt(fetcher.data.defaultFeedback.status));
            setNote(fetcher.data.defaultFeedback.note || "");
            setPlayerCount(parseInt(fetcher.data.defaultFeedback.playerCount));
        }
    });

    const onAdd = () => {
        setPlayerCount(playerCountHelper.add(playerCount))
    }
    const onSubtract = () => {
        setPlayerCount(playerCountHelper.subtract(playerCount))
    }

    const postStatus = () => {
        if (!!playerFeedback) {
            fetcher.submit(
                {
                    status: feedbackStatus.toString(),
                    note: note,
                    gameId: playerFeedback.gameId,
                    playerCount: playerCount.toString(),
                    origin: "dashboard",
                },
                {
                    method: "post",
                    action: routeLinks.player.feedback({
                        gameId: playerFeedback.gameId,
                        playerId: playerFeedback.playerId
                    }),
                }
            );
        }
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
                        <PlayerStatus status={feedbackStatus ?? 0}
                                      setStatus={(newStatus: number) => setFeedbackStatus(newStatus)}/>
                    </ContentContainer>
                </motion.div>
                <motion.div variants={animationConfig.animationItems}>
                    <p className={"font-default-medium text-gray-600"}>
                        {messages.game.feedback.headings.playerCount}
                    </p>
                    <ContentContainer>
                        <PlayerCount playerCount={playerCount}
                                     onAdd={onAdd}
                                     onSubtract={onSubtract}/>
                    </ContentContainer>
                </motion.div>
                <motion.div variants={animationConfig.animationItems}>
                    <TextAreaWithLabel
                        id={"note"}
                        name={"note"}
                        label={messages.game.feedback.headings.note}
                        defaultValue={note ?? ''}
                        onChange={(newNote: string) => setNote(newNote)}/>
                </motion.div>
                <div className={"hover:cursor-pointer focus:cursor-pointer"}
                     onClick={postStatus}>
                    <DefaultButton>
                        <motion.button type={"button"}>{messages.buttons.save}</motion.button>
                    </DefaultButton>
                </div>
            </motion.div>
        </>
    );
};

export default PlayerFeedback;
