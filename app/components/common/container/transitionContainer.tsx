import {useTransition} from "@remix-run/react";
import {AnimatePresence, motion} from "framer-motion";
import {PropsWithChildren} from "react";
import messages from "~/components/i18n/messages";

type TransitionContainerProps = {}

const Placeholder = () => {
    return (
        <div className="grid place-items-center h-screen text-2xl">
            <div>
                <i className="fa fa-refresh fa-spin fa-fw"></i>
                <span className={"text-2xl"}>{messages.app.wait}</span>
            </div>
        </div>
    )
}

const TransitionContainer = ({children}: PropsWithChildren<TransitionContainerProps>) => {
    const transition = useTransition()
    let activeTransition = transition.state !== "idle"
    return (
        <AnimatePresence>
            {activeTransition && <motion.div
                initial={{x: "-100%"}}
                animate={{x: 0, transition: {duration: 1.5}}}
                exit={{opacity: 0, x: "100%", transition: {duration: 1.5}}}
                key={"transition"}
            >
                <Placeholder/>
            </motion.div>
            }
            {!activeTransition && <motion.div
                initial={{opacity: 0}}
                animate={{opacity: 1, transition: {duration: 1}}}
                exit={{opacity: 0, transition: {duration: 1}}}
                key={"content"}
            >
                {children}
            </motion.div>
            }
        </AnimatePresence>
    )
}

export default TransitionContainer