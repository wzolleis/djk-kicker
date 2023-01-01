import messages from "~/components/i18n/messages";
import {useTransition} from "@remix-run/react";

const LoadingSkeleton = () => {
    const transition = useTransition()

    let actionText = messages.app.loading
    if (transition.state === "submitting") {
        actionText = messages.app.saving
    }

    return (
        <div className="flex h-screen items-center justify-center">
            <div className={"flex flex-col items-center"}>
                <h1>{actionText}</h1>
            </div>
        </div>

    )
}

export default LoadingSkeleton