

function determineBackroundColorFromStatusCode(statusCode: number): string {
    switch (statusCode) {
        case 500:
            return 'bg-red-500'
    }
    return 'bg-gray-500'
}


const HTTPStatusTag = ({status}: { status: number }) => {

    const backgroundColor = determineBackroundColorFromStatusCode(status)

    return (
        <>
            <div className={`px-1 py-2 rounded text-white flex items-center justify-center ${backgroundColor}`}>
                <p className={"text-label-medium font-default-medium"}>Status: {status}</p>
            </div>

        </>
    )


}

export default HTTPStatusTag;