// const PlayerListWithPaging = ({player: allPlayer}: { player: Player[] }) => {
//     const [currentPage, setCurrentPage] = useState<number>(1)
//
//     const pagination: PaginationResult = paginate(allPlayer.length, currentPage, 5, 100)
//     const visiblePlayer = allPlayer.slice(pagination.startIndex, pagination.endIndex).sort((p1, p2) => p1.name.localeCompare(p2.name))
//
//     const previousPage = () => {
//         const prevPage = currentPage - 1
//         setCurrentPage(prevPage >= 1 ? prevPage : 1)
//     }
//
//     const nextPage = () => {
//         const nextPage = currentPage + 1
//         setCurrentPage(nextPage <= pagination.totalPages ? nextPage : pagination.totalPages)
//     }
//
//     return (
//         <>
//             <div className="flex flex-col grid-cols-2 md:flex-row justify-start gap-5 mt-5 h-fit mb-10">
//                 <ul className="bg-white rounded-lg border border-gray-200 w-full text-gray-900 overflow-auto h-100px bg-green-100">
//                     {visiblePlayer.map(player => {
//                         return (
//                             <PlayerCard player={player} key={player.id}/>
//                         )
//                     })}
//                 </ul>
//             </div>
//
//             <div>
//                 <span>Seite {pagination.currentPage} von {pagination.totalPages}</span>
//                 <div className={"mt-5"}>
//                     <button
//                         type={"button"}
//                         onClick={previousPage}
//                         className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
//                     >
//                         Previous
//                     </button>
//
//                     <button
//                         type={"button"}
//                         onClick={nextPage}
//                         className="inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
//                         Next
//                     </button>
//                 </div>
//             </div>
//
//         </>
//     )
// }
const ignore_me = "ignore_me"
export default ignore_me