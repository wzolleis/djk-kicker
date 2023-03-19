import type {ReactNode} from "react";
import classNames from 'classnames'

const Button = ({children, className}: { children: ReactNode, className?: string | undefined }) => {
    return (
        <div
            className={
                classNames("flex items-center justify-center gap-2 rounded px-3 py-2 font-default-medium text-white transition duration-150 ease-in-out hover:scale-90", className)
            }
        >
            {children}
        </div>
    );
};

export default Button;
