import ContentContainer from "~/components/common/container/ContentContainer";
import Subheading from "~/components/common/header/Subheading";

type StarCounterProps = {
    count: number, totalCount: number
}
const StarCounter = ({count, totalCount}: StarCounterProps) => {
    const filledStars = []
    for (let i = 0; i < count; i++) {
        filledStars.push({id: i})
    }
    const emptyStars = []
    for (let i = 0; i < totalCount - count; i++) {
        emptyStars.push({id: totalCount + i})
    }


    return (
        <div className="flex items-center">
            {
                filledStars.map((star) => {
                    return <i key={star.id} className="fa-solid fa-star text-yellow-500"></i>
                })
            }
            {
                emptyStars.map((star) => {
                    return <i key={star.id} className="fa-solid fa-star"></i>
                })
            }
        </div>
    )
}

const Rating = () => {
    const totalStarCount = 5
    return (
        <>
            <ContentContainer>
                <Subheading title={"Mein Rating"}/>
                <div className="flex items-center mb-5">
                    <p className="bg-blue-100 text-blue-800 text-sm font-semibold inline-flex items-center p-1.5 rounded dark:bg-blue-200 dark:text-blue-800">33</p>
                    <p className="ml-2 font-medium text-gray-900">Geht so</p>
                </div>
                <div className="gap-8 sm:grid sm:grid-cols-2">
                    <div>
                        <dl>
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Technik</dt>
                            <dd className="flex items-center mb-3">
                                <div className="w-full bg-gray-200 rounded h-2.5 dark:bg-gray-700 mr-2">
                                    <div className="bg-blue-600 h-2.5 rounded dark:bg-blue-500" style={{width: '40%'}}></div>
                                </div>
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">40</span>
                            </dd>
                        </dl>
                        <dl>
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Geschwindigkeit</dt>
                            <dd className="flex items-center mb-3">
                                <div className="w-full bg-gray-200 rounded h-2.5 dark:bg-gray-700 mr-2">
                                    <div className="bg-blue-600 h-2.5 rounded dark:bg-blue-500" style={{width: '40%'}}></div>
                                </div>
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">40</span>
                            </dd>
                        </dl>
                        <dl>
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Ausdauer</dt>
                            <dd className="flex items-center mb-3">
                                <div className="w-full bg-gray-200 rounded h-2.5 dark:bg-gray-700 mr-2">
                                    <div className="bg-blue-600 h-2.5 rounded dark:bg-blue-500" style={{width: '20%'}}></div>
                                </div>
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">20</span>
                            </dd>
                        </dl>
                    </div>

                </div>
            </ContentContainer>
            <ContentContainer className={'mt-4'}>
                <Subheading title={"Übersicht"}/>
                <div>


                    <div className="relative overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    Name
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Gesamt
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Technik
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Geschwindigkeit
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Ausdauer
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    Mister X.
                                </td>
                                <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    100
                                </td>
                                <td className="px-6 py-4">
                                    <StarCounter count={5} totalCount={totalStarCount}/>
                                </td>
                                <td className="px-6 py-4">
                                    <StarCounter count={5} totalCount={totalStarCount}/>
                                </td>
                                <td className="px-6 py-4">
                                    <StarCounter count={5} totalCount={totalStarCount}/>
                                </td>
                            </tr>
                            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    Mister Y.
                                </td>
                                <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    20
                                </td>
                                <td className="px-6 py-4">
                                    <StarCounter count={2} totalCount={totalStarCount}/>
                                </td>
                                <td className="px-6 py-4">
                                    <StarCounter count={2} totalCount={totalStarCount}/>
                                </td>
                                <td className="px-6 py-4">
                                    <StarCounter count={2} totalCount={totalStarCount}/>
                                </td>
                            </tr>
                            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    Mister Z.
                                </td>
                                <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    35
                                </td>
                                <td className="px-6 py-4">
                                    <StarCounter count={1} totalCount={totalStarCount}/>
                                </td>
                                <td className="px-6 py-4">
                                    <StarCounter count={3} totalCount={totalStarCount}/>
                                </td>
                                <td className="px-6 py-4">
                                    <StarCounter count={4} totalCount={totalStarCount}/>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>


                </div>
            </ContentContainer>
        </>
    )
}

export default Rating