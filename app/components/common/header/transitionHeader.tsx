import {useTransition} from "@remix-run/react";
import messages from "~/components/i18n/messages";
import Subheading from "~/components/common/header/Subheading";
import classNames from "classnames";

const TransitionHeader = ({idleLabel, hidden}: { idleLabel: string, hidden?: boolean }) => {
    const transition = useTransition()
    const idle = transition.state === 'idle'

    if (hidden) return null

    let title = idleLabel
    switch (transition.state) {
        case "loading":
            title = messages.app.process
            break
        case "submitting":
            title = messages.app.process
            break
    }

    const style = {
        ["flex"]: !idle,
        ["flex-col"]: !idle,
    }

    return (
        <div className={classNames(style)}>
            <Subheading title={title}/>
        </div>
    )
}

export default TransitionHeader