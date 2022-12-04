import {GameAction} from "@prisma/client";
import dateUtils from "~/dateUtils";
import {Link} from "@remix-run/react";
import {actionTypeKey, actionTypes, config} from "~/components/i18n/config";
import HTTPStatusTag from "~/components/common/tags/HTTPStatusTag";

const ActionCard = ({action}: { action: GameAction }) => {
    let background = ''
    let image = ''
    switch (action.actionType) {
        case 'GAME_INVITATION':
            background = 'ring-indigo-600'
            image = 'mail-black'
            break
        case 'GAME_ZUSAGE':
            background = 'ring-green-600'
            image = 'mail-check'
            break
        case 'GAME_ABSAGE':
            background = 'ring-red-600'
            image = 'mail-decline'
            break
        default:
            background = ''
            break
    }

    console.log(action);
    return (
        <div className={`flex items-center p-3 rounded-xl ring ring-1 ${background}`}>

            <div className="">
                <HTTPStatusTag status={action.status!}></HTTPStatusTag>
                <div className={"flex gap-2 items-center"}>
                    <img className={"h-4"} src={`/img/icons/${image}.png`} alt=""/>
                    <p className="text-title-medium text-black font-default-bold">
                        {config.actionTypes[action.actionType as actionTypeKey]}
                    </p>
                </div>
                <p className="text-sm text-gray-500 truncate">
                    {dateUtils.format(new Date(action.updatedAt))}
                </p>
            </div>
            <div className="flex items-center justify-between mb-4"/>

        </div>
    )
}


export default ActionCard;