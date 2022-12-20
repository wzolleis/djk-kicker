import { AnimatePresence, motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";
import { an } from "vitest/dist/global-58e8e951";
import messages from "~/components/i18n/messages";

type PlayerCountProps = {
  playerCount: number;
  onAdd: any;
  onSubtract: any;
};

export const PlayerCount = ({ playerCount, onAdd, onSubtract }: PlayerCountProps) => {
  const animationControls = useAnimation();

  useEffect(() => {
    animationControls.start({
      scale: 1,
      transition: {
        type: "spring",
        velocity: 50,
        stiffness: 800,
        damping: 80,
      },
    });
  }, [playerCount]);

  return (
    <AnimatePresence>
      <div className={"flex items-center justify-center gap-3"}>
        <button
          type={"button"}
          className={"flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 p-3 font-default-semibold transition ease-in-out hover:scale-90"}
          onClick={() => onAdd()}>
          <img src="/img/icons/add.png" alt="" />
        </button>
        <motion.div className={"font-inter-bold text-headline-small text-indigo-600"} animate={animationControls}>
          {playerCount}
        </motion.div>
        <button
          type={"button"}
          className={"flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 p-3 font-default-semibold transition ease-in-out hover:scale-90"}
          onClick={() => onSubtract()}>
          <img src="/img/icons/close-white.png" alt="" />
        </button>
      </div>
    </AnimatePresence>
  );
};
