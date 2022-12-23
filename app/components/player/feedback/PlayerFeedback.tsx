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

type PlayerFeedbackProps = {
  playerFeedback: Feedback;
};

const PlayerFeedback = ({ playerFeedback }: PlayerFeedbackProps) => {
  const [feedbackStatus, setFeedbackStatus] = useState(playerFeedback.status);
  const [note, setNote] = useState(playerFeedback?.note || "");
  const [playerCount, setPlayerCount] = useState(playerFeedback.playerCount);
  const fetcher = useFetcher();
  useEffect(() => {
    if (fetcher.data?.defaultFeedback) {
      setFeedbackStatus(parseInt(fetcher.data.defaultFeedback.status));
      setNote(fetcher.data.defaultFeedback.note || "");
      setPlayerCount(parseInt(fetcher.data.defaultFeedback.playerCount));
    }
  });

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

  const items = {
    initial: {
      y: 100,
    },
    animate: {
      y: 0,
      transition: {
        ease: [0.6, 0.01, -0.05, 0.95],
        duration: 1,
      },
    },
  };

  const onAdd = () => {
    setPlayerCount(playerCountHelper.add(playerCount))
  }
  const onSubtract = () => {
    setPlayerCount(playerCountHelper.subtract(playerCount))
  }

  function postStatus() {
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
        action: `/application/games/${playerFeedback.gameId}/player/${playerFeedback.playerId}?index`,
      }
    );
  }


  return (
    <>
      <motion.div variants={container} initial={"initial"} animate={"animate"} className={"flex flex-col gap-3"}>
        <p className={"font-default-medium text-gray-600"}>{messages.game.feedback.headings.feedback}</p>
        <motion.div variants={items}>
          <ContentContainer>
            <PlayerStatus status={feedbackStatus} setStatus={(newStatus: number) => setFeedbackStatus(newStatus)} />
          </ContentContainer>
        </motion.div>
        <motion.div variants={items}>
          <p className={"font-default-medium text-gray-600"}>{messages.game.feedback.headings.playerCount}</p>
          <ContentContainer>
            <PlayerCount playerCount={playerCount} onAdd={onAdd} onSubtract={onSubtract}></PlayerCount>
          </ContentContainer>
        </motion.div>
        <motion.div variants={items}>
          <TextAreaWithLabel
            id={"note"}
            name={"note"}
            label={messages.game.feedback.headings.note}
            defaultValue={note!}
            onChange={(newNote: string) => setNote(newNote)}></TextAreaWithLabel>
        </motion.div>
        <div className={"hover:cursor-pointer focus:cursor-pointer"} onClick={() => postStatus()}>
          <DefaultButton>
            <motion.button type={"button"}>{messages.buttons.save}</motion.button>
          </DefaultButton>
        </div>
      </motion.div>
    </>
  );
};

export default PlayerFeedback;
