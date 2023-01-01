import {PropsWithChildren} from "react";
import classNames from "classnames";

const ContentContainer = ({children, className}: PropsWithChildren<{ className?: string }>) => {
    const classNameOrDefault = className ?? "bg-white"
    // const opacity = transition.state === "idle" ? "opacity-100" : "opacity-50"
    return (
        <div className={classNames("rounded-xl p-3 ring ring-1 ring-indigo-100", classNameOrDefault)}>
            {children}
        </div>
    )
};

export default ContentContainer;
