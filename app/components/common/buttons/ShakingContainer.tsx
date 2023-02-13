import React, {PropsWithChildren, useRef} from "react";
import {AnimatePresence, motion} from "framer-motion";

type ShakingButtonProps = {
    onClick?: React.MouseEventHandler<HTMLDivElement>,
    className?: string,
}

const ShakingContainer = ({
                              children,
                              className,
                              onClick,
                          }: PropsWithChildren<ShakingButtonProps>) => {
    const ref = useRef(0);
    return (
        <AnimatePresence exitBeforeEnter initial={false}>
            <motion.div
                key={ref.current}
                initial={{y: -30}}
                animate={{y: 0}}
                exit={{y: -30}}
                transition={{duration: .2}}
                onClick={(e) => {
                    onClick && onClick(e);
                    ref.current++;
                }}
                className={className}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}

export default ShakingContainer;