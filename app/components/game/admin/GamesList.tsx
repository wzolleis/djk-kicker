import {Game} from "@prisma/client";
import {useDateTime} from "~/utils";
import classNames from "classnames";

type GamesListProps = {
    games: Game[];
}

// type TableCellProps = {
//     value: string
// }
//
// type TableHeaderProps = {
//     title: string
// }

// const TableCell = ({value}: TableCellProps) => {
//     return (
//         <td className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap">
//             {value}
//         </td>
//     )
// }
//
// const TableHeader = ({title}: TableHeaderProps) => {
//     return (
//         <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-2">
//             {title}
//         </th>
//     )
// }

const GamesList = ({games}: GamesListProps) => {
    return (
        <>
            {
                games.map((game) => {
                    const gameStatusClasses = {
                        'text-red-500': !!game.status && game.status === 'Absage',
                        'text-green-500': !!game.status && game.status === 'Zusage',
                    }

                    return (
                        <div className="container mx-auto" key={game.id}>
                            <div className="h-50 w-full rounded-lg bg-blue-200">
                                <div className="flex items-center justify-between border-b">
                                    <div
                                        className="p-3 text-gray-700 text-lg font-bold">{`${game.name || 'Spiel'} am ${useDateTime(game.gameTime)}`}</div>
                                    <div className="p-3 flex">
                                        <button
                                            className="text-slate-800 hover:text-blue-600 text-sm bg-white hover:bg-slate-100 border border-slate-200 rounded-l-lg font-small md:font-medium px-4 py-2 inline-flex space-x-1 items-center">
                                            <i className={"fa fa-edit mx-1"}/>
                                            <span className={"hidden lg:inline px-1"}>Bearbeiten</span>
                                        </button>
                                        <button
                                            className="text-slate-800 hover:text-blue-600 text-sm bg-white hover:bg-slate-100 border border-slate-200 rounded-r-lg font-small md:font-medium px-4 py-2 inline-flex space-x-1 items-center">
                                            <i className={"fa fa-trash mx-1"}/>
                                            <span className={"hidden lg:inline"}>Löschen</span>
                                        </button>
                                    </div>
                                </div>
                                <div className={classNames( "p-3 text-lg", gameStatusClasses)}>
                                    {game.status ?? "Noch kein Status"}
                                </div>
                                <div className="p-3 border-t text-lg text-gray-600 bg-blue-500">
                                    <div className="flex">
                                        <button
                                            className="ml-auto p-3 text-slate-800 hover:text-blue-600 text-sm bg-white hover:bg-slate-100 border border-slate-200 font-small md:font-medium px-4 py-2 inline-flex space-x-1 items-center">
                                            <i className={"fa fa-envelope"}/>
                                            <span className={"hidden lg:inline px-1"}>Einladung</span>
                                        </button>
                                        <button
                                            className="text-slate-800 hover:text-blue-600 text-sm bg-white hover:bg-slate-100 border border-slate-200  font-small md:font-mediumpx-4 py-2 inline-flex space-x-1 items-center">
                                            <i className={"fa-solid fa-thumbs-up mx-1 text-green-500"}/>
                                            <span className={"hidden lg:inline text-green-500"}>Zusage</span>
                                        </button>
                                        <button
                                            className="text-slate-800 hover:text-blue-600 text-sm bg-white hover:bg-slate-100 border border-slate-200 font-small md:font-medium px-4 py-2 inline-flex space-x-1 items-center">
                                            <i className={"fa-solid fa-thumbs-down mx-1 text-red-500"}/>
                                            <span className={"hidden lg:inline text-red-500"}>Absage</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })
            }
        </>
    )
}


// const GamesTable = ({games}: GamesListProps) => {
//     return (
//         <div className="flex flex-col">
//             <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
//                 <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
//                     <div className="overflow-hidden">
//                         <table className="min-w-full text-center">
//                             <thead className="border-b bg-white">
//                             <tr>
//                                 <TableHeader title={messages.adminGamesTable.id}/>
//                                 <TableHeader title={messages.adminGamesTable.name}/>
//                                 <TableHeader title={messages.adminGamesTable.location}/>
//                                 <TableHeader title={messages.adminGamesTable.gametime}/>
//                                 <TableHeader title={messages.adminGamesTable.status}/>
//                                 <TableHeader title={messages.adminGamesTable.actions}/>
//                             </tr>
//                             </thead>
//                             <tbody>
//                             {
//                                 games.map((game) => {
//                                     return (
//                                         <tr className="bg-white border-b" key={game.id}>
//                                             <TableCell value={game.id}/>
//                                             <TableCell value={game.name}/>
//                                             <TableCell value={messages.adminGamesTable.spielortTxt(game.spielort)}/>
//                                             <TableCell value={useDateTime(game.gameTime)}/>
//                                             <TableCell value={game.status ?? ''}/>
//                                             <td>
//                                                 <button type="button"
//                                                         className="text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center">
//                                                     <p className={"fa fa-envelope"}/>
//                                                     <span className="sr-only">Icon description</span>
//                                                 </button>
//                                                 <button type="button"
//                                                         className="ml-2 text-green-700 border border-green-700 hover:bg-green-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center">
//                                                     <p className={"fa fa-check"}/>
//                                                     <span className="sr-only">Icon description</span>
//                                                 </button>
//                                                 <button type="button"
//                                                         className="ml-2 text-red-700 border border-red-700 hover:bg-red-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center">
//                                                     <p className={"fa fa-cancel"}/>
//                                                     <span className="sr-only">Icon description</span>
//                                                 </button>
//                                                 <button type="button"
//                                                         className="ml-2 text-red-700 border border-red-700 hover:bg-red-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center">
//                                                     <p className={"fa fa-trash"}/>
//                                                     <span className="sr-only">Icon description</span>
//                                                 </button>
//                                             </td>
//                                         </tr>
//                                     )
//                                 })
//                             }
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

export default GamesList;