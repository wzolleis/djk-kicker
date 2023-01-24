import {Game} from "@prisma/client";
import messages from "~/components/i18n/messages";
import {useDateTime} from "~/utils";

type GamesListProps = {
    games: Game[];
}

type TableCellProps = {
    value: string
}

type TableHeaderProps = {
    title: string
}

const TableCell = ({value}: TableCellProps) => {
    return (
        <td className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap">
            {value}
        </td>
    )
}

const TableHeader = ({title}: TableHeaderProps) => {
    return (
        <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-2">
            {title}
        </th>
    )
}

const GamesList = ({games}: GamesListProps) => {
    return (
        <div className="flex flex-col">
            <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
                    <div className="overflow-hidden">
                        <table className="min-w-full text-center">
                            <thead className="border-b bg-white">
                            <tr>
                                <TableHeader title={messages.adminGamesTable.id}/>
                                <TableHeader title={messages.adminGamesTable.name}/>
                                <TableHeader title={messages.adminGamesTable.location}/>
                                <TableHeader title={messages.adminGamesTable.gametime}/>
                                <TableHeader title={messages.adminGamesTable.status}/>
                                <TableHeader title={messages.adminGamesTable.actions}/>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                games.map((game) => {
                                    return (
                                        <tr className="bg-white border-b" key={game.id}>
                                            <TableCell value={game.id}/>
                                            <TableCell value={game.name}/>
                                            <TableCell value={messages.adminGamesTable.spielortTxt(game.spielort)}/>
                                            <TableCell value={useDateTime(game.gameTime)}/>
                                            <TableCell value={game.status ?? ''}/>
                                            <td>
                                                <button type="button"
                                                        className="text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center">
                                                    <p className={"fa fa-envelope"}/>
                                                    <span className="sr-only">Icon description</span>
                                                </button>
                                                <button type="button"
                                                        className="ml-2 text-green-700 border border-green-700 hover:bg-green-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center">
                                                    <p className={"fa fa-check"}/>
                                                    <span className="sr-only">Icon description</span>
                                                </button>
                                                <button type="button"
                                                        className="ml-2 text-red-700 border border-red-700 hover:bg-red-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center">
                                                    <p className={"fa fa-cancel"}/>
                                                    <span className="sr-only">Icon description</span>
                                                </button>
                                                <button type="button"
                                                        className="ml-2 text-red-700 border border-red-700 hover:bg-red-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center">
                                                    <p className={"fa fa-trash"}/>
                                                    <span className="sr-only">Icon description</span>
                                                </button>
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

export default GamesList;