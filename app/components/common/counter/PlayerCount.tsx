import {AnimatePresence, motion, useAnimation} from "framer-motion";
import {useEffect} from "react";

type PlayerCountProps = {
  playerCount: number;
  onAdd: () => void;
  onSubtract: () => void;
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
            className={"flex fa fa-minus h-12 w-12 items-center text-white justify-center rounded-full bg-indigo-600 p-3 font-default-semibold transition ease-in-out hover:scale-90"}
            onClick={onSubtract}>
        </button>
        <motion.div className={"font-inter-bold text-headline-small text-indigo-600"} animate={animationControls}>
          {playerCount}
        </motion.div>
        <button
            type={"button"}
            className={"flex fa fa-plus h-12 w-12 items-center text-white justify-center rounded-full bg-indigo-600 p-3 font-default-semibold transition ease-in-out hover:scale-90"}
            onClick={onAdd}>
        </button>
      </div>
    </AnimatePresence>
  );
};
