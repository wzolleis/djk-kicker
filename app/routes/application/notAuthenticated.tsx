import messages from "~/components/i18n/messages";

const NotAuthenticated = () => {
    return (
        <>
            <div className={"bg-red-100 rounded-xl p-3 ring ring-1 ring-red-200"}>
                <p className={"font-default-regular text-label-medium text-red-800"}>{messages.warnings.notAuthenticated}</p>
            </div>
        </>
    )
}

export default NotAuthenticated