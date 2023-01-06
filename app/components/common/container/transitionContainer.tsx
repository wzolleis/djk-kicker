import {useTransition} from "@remix-run/react";
import {AnimatePresence, motion} from "framer-motion";
import {PropsWithChildren} from "react";
import messages from "~/components/i18n/messages";

type TransitionContainerProps = {}

const TransitionContainer = ({children}: PropsWithChildren<TransitionContainerProps>) => {
    const transition = useTransition()
    let activeTransition = transition.state !== "idle"

    console.log(">>> transition = ", transition)

    return (
        <AnimatePresence>
            {
                activeTransition &&
                <motion.div
                    initial={{opacity: 0}}
                    animate={{opacity: 1, transition: {duration: 0.1, delay: 0.5}}}
                    exit={{opacity: 0, x: "100%", transition: {duration: 0.1, delay: 0.5}}}
                    key={"show_processing"}
                >
                    <span>{messages.app.process}</span>
                </motion.div>
            }
            {!activeTransition &&
                <motion.div
                    initial={{opacity: 0, x: "-100%"}}
                    animate={{opacity: 1, x: 0, transition: {duration: 1.5, delay: 0.2}}}
                    exit={{opacity: 0, x: "100%", transition: {duration: 1.5, delay: 0.2}}}
                    key={"content"}
                >
                    {children}
                </motion.div>
            }
        </AnimatePresence>
    )
}

export default TransitionContainer