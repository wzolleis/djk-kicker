import messages from "~/components/i18n/messages";
import {useTransition} from "@remix-run/react";

export type SubmitButtonProps = {
    className?: string
    type?: 'submit' | 'reset' | 'button' | undefined;

    name?: string
    value?: string

    idleLabel: string
    loadingLabel?: string
    savingLabel?: string
}

const SubmitButton = (props: SubmitButtonProps) => {
    const transition = useTransition()

    let label = ''
    switch (transition.state) {
        default:
        case "idle":
            label = props.idleLabel
            break
        case "loading":
            label = props.loadingLabel ?? messages.app.loading
            break
        case "submitting":
            label = props.savingLabel ?? messages.app.saving
            break
    }

    return (
        <button
            type={props.type ?? "submit"}
            name={props.name}
            value={props.value}
            disabled={transition.state !== 'idle'}
            className={props.className}
        >
            {label}
        </button>
    )
}

export default SubmitButton