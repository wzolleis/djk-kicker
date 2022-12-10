import type {ReactNode} from "react";
import classNames from 'classnames'

const ButtonContainer = ({children, className}: { children: ReactNode, className?: string | undefined }) => {
    return (
        <div className={classNames("flex justify-start gap-2 pt-2", className)}>
            {children}
        </div>
    );
};

export default ButtonContainer;
