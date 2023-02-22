import {useTransition} from "@remix-run/react";
import {PropsWithChildren} from "react";

export type SubmitButtonProps = {
    className?: string
    type?: 'submit' | 'reset' | 'button' | undefined;

    name?: string
    value?: string

    loadingLabel?: string
    savingLabel?: string

    label: string

    showTransitionSpinner?: boolean
}

const SubmitButton = (props: PropsWithChildren<SubmitButtonProps>) => {
    const transition = useTransition()
    let activeTransition = transition.state !== "idle"
    let label = ''
    switch (transition.state) {
        default:
        case "idle":
            label = props.label
            break
        case "loading":
            label = props.loadingLabel ?? props.label
            break
        case "submitting":
            label = props.savingLabel ?? props.label
            break
    }

    const showTransitionSpinner = !!props.showTransitionSpinner && activeTransition

    return (
        <button
            type={props.type ?? "submit"}
            name={props.name}
            value={props.value}
            disabled={activeTransition}
            className={props.className}
        >
            {
                showTransitionSpinner && <p className={"fa fa-spinner animate-spin mr-1"}/>
            }
            {
                !showTransitionSpinner && props.children
            }
            {label}
        </button>
    )
}

export default SubmitButton