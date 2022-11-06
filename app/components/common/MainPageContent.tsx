import type {ReactNode} from "react";


type MainPageContentProps = {
    children: ReactNode | ReactNode[];
}


const MainPageContent = ({children}: MainPageContentProps) => {
    return (
        <main className={"flex flex-col py-3"}>
            {children}
        </main>

    )


}

export default MainPageContent