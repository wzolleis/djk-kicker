import {ReactNode} from "react";

type SelectorProps = {
    children: ReactNode[]
}


const Selector = ({children}: SelectorProps) => {
    return (
        <>
            <nav className={"flex w-full items-center gap-3"}>
                {children}
            </nav>

        </>
    )
}

export default Selector;