import ContentContainer from "~/components/common/container/ContentContainer";
import Subheading from "~/components/common/header/Subheading";

const Rating = () => {
    return (
        <>
            <ContentContainer>
                <Subheading title={"Mein Rating"}/>
                <div className="flex items-center mb-5">
                    <p className="bg-blue-100 text-blue-800 text-sm font-semibold inline-flex items-center p-1.5 rounded dark:bg-blue-200 dark:text-blue-800">40</p>
                    <p className="ml-2 font-medium text-gray-900">Geht so</p>
                </div>
                <div className="gap-8 sm:grid sm:grid-cols-2">
                    <div>
                        <dl>
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Wertung</dt>
                            <dd className="flex items-center mb-3">
                                <div className="w-full bg-gray-200 rounded h-2.5 dark:bg-gray-700 mr-2">
                                    <div className="bg-blue-600 h-2.5 rounded dark:bg-blue-500" style={{width: '40%'}}></div>
                                </div>
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">40</span>
                            </dd>
                        </dl>
                    </div>
                </div>
            </ContentContainer>
        </>
    )
}

export default Rating