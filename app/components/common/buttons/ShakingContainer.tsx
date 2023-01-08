import React, {PropsWithChildren, useRef} from "react";
import {motion} from "framer-motion";

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
        <motion.div
            key={ref.current}
            animate={ref.current === 0 ? {} : {
                x: [0, 10, -10, 0]
            }}
            transition={{
                type: "spring",
            }}
            onClick={(e) => {
                onClick && onClick(e);
                ref.current++;
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

export default ShakingContainer;