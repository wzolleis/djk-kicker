import {PropsWithChildren} from "react";

export type ExpandableProps = {
    hidden: boolean
}
const ExpandableContainer = ({hidden, children}: PropsWithChildren<ExpandableProps>) => {
    if (hidden) return null
    return (
        <>
            {children}
        </>
    )
}

export default ExpandableContainer
