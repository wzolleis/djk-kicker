import type {PropsWithChildren} from "react";


const MainPageContent = ({children}: PropsWithChildren<{}>) => {
    return (
        <main className={"flex flex-col py-3"}>
            {children}
        </main>

    )


}

export default MainPageContent