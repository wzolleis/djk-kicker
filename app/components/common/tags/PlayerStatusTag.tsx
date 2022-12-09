import {parseStatus} from "~/utils/statusUtils";
import {statusInConfig} from "~/config/status";
import {configuration} from "~/config";

type playerStatusTagProps = {
    status: number;
};

const PlayerStatusTag = ({status}: playerStatusTagProps) => {
    const getStatusColor = (status: statusInConfig) => {
        switch (status) {
            case configuration.status.unknown:
                return "bg-white text-gray-500 ring ring-1 ring-gray-200";
            case configuration.status.confirmed:
                return "bg-green-100 text-green-600 ring-green-200";
            case configuration.status.declined:
                return "bg-red-100 text-red-600 ring-red-200";
            case configuration.status.undecided:
                return "bg-yellow-100 text-yellow-600 ring-yellow-200";
        }
    };


    const getStatusImageUrl = () => {
        switch (status) {
            case configuration.status.unknown:
                return "/img/unknown.png";
            case configuration.status.confirmed:
                return "/img/thumbs-up.png";
            case configuration.status.declined:
                return "/img/thumbs-down.png";
            case configuration.status.undecided:
                return "/img/thinking.png";
        }
    }

    return (
        <div
            className={`rounded-lg py-1 px-3 font-poppins-regular text-label-medium ring ring-1 flex gap-2 ${getStatusColor(
                status
            )}`}
        >

            <img  className={"w-5 h-5"} src={getStatusImageUrl()} alt=""/>
            {parseStatus(status)}
        </div>
    );
};

export default PlayerStatusTag
