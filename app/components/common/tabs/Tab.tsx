import {ReactNode} from "react";
import {useNavigate} from "@remix-run/react";


type TabProps = {
    isActive: boolean,
    title: string,
    children: ReactNode,
    url?: string
}


const TabComponent = ({isActive, title, children, url}: TabProps) => {
    return (
        <div
            className={`rounded-full py-1.5 px-3 flex items-center gap-2 justify-center text-white text-label-medium font-default-medium transition hover:scale-90 ${isActive ? 'bg-black hover:bg-gray-800' : 'bg-slate-400'}`}
        >
            {children}
            {isActive &&
                <p className={"text-center"}>{title}</p>
            }
        </div>
    )
}


const Tab = ({isActive, title, children, url}: TabProps) => {

    const navigate = useNavigate();
    const handleClick = () => {
        const currentUrl = window.location.pathname.split("/")
        currentUrl.pop();
        navigate(`${currentUrl.join("/")}/${url}`)
    }
    if (url) {
        return (
            <button type={"button"} onClick={() => handleClick()}>
                <TabComponent isActive={isActive} title={title}>
                    {children}
                </TabComponent>
            </button>
        )
    } else {
        return (
                <TabComponent isActive={isActive} title={title}>
                    {children}
                </TabComponent>
            )
    }


}

export default Tab;