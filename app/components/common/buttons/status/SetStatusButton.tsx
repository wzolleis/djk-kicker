import React from "react";

export type SetStatusButtonProps = {
    image: string,
    onClick: React.MouseEventHandler<HTMLDivElement>,
    isActive: boolean,
    activeColor: string
}


const SetStatusButton = ({image, onClick, isActive, activeColor}: SetStatusButtonProps) => {

    return (
        <>
            <div
                className={`flex items-center justify-center p-5 rounded-xl transition ease-in-out duration-100  ${isActive ? ' scale-110 bg-' + activeColor : 'bg-gray-200'}`}
                onClick={onClick}>
                <img src={image} className={"h-10 w-10"} alt=""/>
            </div>

        </>
    )
}


export default SetStatusButton