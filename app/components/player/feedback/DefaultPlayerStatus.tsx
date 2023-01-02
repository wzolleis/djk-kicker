import SetStatusButton from "~/components/common/buttons/SetStatusButton";
import {configuration} from "~/config";
import React from "react";

type PlayerFeedbackProps = {
    status: number;
    setStatus: (status: number) => void;
};

export const DefaultPlayerStatus = ({status, setStatus}: PlayerFeedbackProps) => {
    return (
        <div>
            <div className={"flex w-full items-center justify-start gap-5"}>
                <SetStatusButton
                    image={"/img/thumbs-up.png"}
                    onClick={() => setStatus(configuration.status.confirmed)}
                    isActive={status === configuration.status.confirmed}
                    activeColor={"bg-green-500"}
                />
                <SetStatusButton
                    image={"/img/thumbs-down.png"}
                    onClick={() => setStatus(configuration.status.declined)}
                    isActive={status === configuration.status.declined}
                    activeColor={"bg-red-500"}
                />
                <SetStatusButton
                    image={"/img/thinking.png"}
                    onClick={() => setStatus(configuration.status.undecided)}
                    isActive={status === configuration.status.undecided}
                    activeColor={"bg-yellow-500"}
                />
            </div>
        </div>
    );
};
