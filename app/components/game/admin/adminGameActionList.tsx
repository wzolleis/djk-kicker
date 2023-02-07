import {isActionType} from "~/config/action";
import messages from "~/components/i18n/messages";
import {GameAction} from "@prisma/client";
import {useDateTime} from "~/utils";


type GameActionListProps = {
    actions: GameAction[]
}

const GameActionList = ({actions}: GameActionListProps) => {
    return (
        <div className={"flex flex-col"}>
            <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
                    <div className="overflow-hidden">
                        <table className="min-w-full text-center">
                            <thead className="border-b">
                            <tr>
                                <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4">
                                    Wann
                                </th>
                                <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4">
                                    Was
                                </th>
                                <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4">
                                    Ergebnis
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                actions.map(action => {
                                    const actionLabel = isActionType(action.actionType) ? messages.actionType[action.actionType] : `${action.actionType}`
                                    return (
                                        <tr className="border-b bg-blue-100 border-blue-200" key={action.id}>
                                            <td className="text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
                                                {useDateTime(action.updatedAt)}
                                            </td>
                                            <td className="text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
                                                {actionLabel}
                                            </td>
                                            <td>
                                                {action.status === 200 ? 'OK' : 'Fehlgeschlagen'}
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GameActionList