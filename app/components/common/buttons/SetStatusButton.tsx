import React from "react";
import classNames from "classnames";
import { motion } from "framer-motion";

export type SetStatusButtonProps = {
  image: string;
  onClick: React.MouseEventHandler<HTMLDivElement>;
  isActive: boolean;
  activeColor: string;
};

const SetStatusButton = ({ image, onClick, isActive, activeColor }: SetStatusButtonProps) => {
  const buttonActive = classNames({ [`bg-${activeColor}`]: isActive }, { [`bg-gray-200`]: !isActive }, "scale-110");
  const variants = {
    initial: {
      rotate: 0,
      scale: 1,
      borderRadius: "100%",
    },
    active: {
      scale: [1, 2, 2, 1, 1],
      rotate: [0, 0, 270, 270, 0],
      borderRadius: ["20%", "20%", "50%", "50%", "20%"],
      transition: {
        type: "spring",
        velocity: 50,
        stiffness: 800,
        damping: 80,
      },
    },
  };

  return (
    <motion.div
      variants={variants}
      initial={"initial"}
      animate={isActive ? "active" : "initial"}
      className={`flex items-center justify-center rounded-full p-5 transition duration-100 ease-in-out ${buttonActive}`}
      onClick={onClick}>
      <img src={image} className={"max-w-10 max-h-10"} alt="" />
    </motion.div>
  );
};

export default SetStatusButton;
