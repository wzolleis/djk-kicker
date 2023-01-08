import {useTransition} from "@remix-run/react";
import {AnimatePresence, motion} from "framer-motion";
import {PropsWithChildren} from "react";
import messages from "~/components/i18n/messages";

type TransitionContainerProps = {}

const Placeholder = ({show}: { show: boolean }) => {
    if (!show) return null
    return (
        <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1, transition: {duration: 1, delayChildren: 0.5}}}
            exit={{opacity: 0, transition: {duration: 1, delayChildren: 0.5}}}
            key={"transition"}
            className="grid place-items-center h-screen text-2xl"
        >
            <div>
                <i className="fa fa-refresh fa-spin fa-fw"></i>
                <span className={"text-2xl"}>{messages.app.wait}</span>
            </div>
        </motion.div>
    )
}

const TransitionContainer = ({children}: PropsWithChildren<TransitionContainerProps>) => {
    const transition = useTransition()
    let activeTransition = transition.state !== "idle"
    return (
        <AnimatePresence>
            <Placeholder show={activeTransition}/>
            {!activeTransition && <motion.div
                initial={{opacity: 0}}
                animate={{opacity: 1, transition: {duration: 1, delayChildren: 0.5}}}
                exit={{opacity: 0, transition: {duration: 1, delayChildren: 0.5}}}
                key={"content"}
            >
                {children}
            </motion.div>
            }
        </AnimatePresence>
    )
}

export default TransitionContainer