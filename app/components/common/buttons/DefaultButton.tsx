import type { ReactNode } from "react";
import classNames from "classnames";
import { useTransition } from "@remix-run/react";

const DefaultButton = ({
    children,
    className,
    fill = true,
}: {
    children: ReactNode;
    className?: string | undefined;
    fill?: boolean;
}) => {
    const buttonFill = classNames(
        { "bg-indigo-600 text-white": fill },
        { "ring ring-1 ring-indigo-600 text-indigo-600 hover:text-white": !fill }
    );

    return (
        <div
            className={classNames(
                "flex items-center justify-center gap-2 rounded px-3 py-2 font-default-medium transition duration-150 ease-in-out hover:scale-90 hover:bg-indigo-400 active:bg-indigo-800",
                buttonFill,
                className
            )}>
            {children}
        </div>
    );
};

export default DefaultButton;
