import {useNavigate} from "@remix-run/react";
import classNames from "classnames";

const BackButton = ({className}: { className?: string }) => {
    const navigate = useNavigate()

    const handleNavigate = () => {
        navigate(-1)
    }

    return (
        <div
            className={
                classNames("flex items-center justify-center gap-2 rounded bg-black px-3 py-2 font-default-medium text-white transition duration-150 ease-in-out hover:scale-125", className)
            }
            onClick={handleNavigate}
        >
            <p className={'fa fa-arrow-circle-left'}/>
            <button type={"button"}/>
        </div>
    )
}

export default BackButton