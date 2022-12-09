import messages from "~/components/i18n/messages";

export const NoTokenWarning = ({hidden}: { hidden: boolean }) => {

    return (
        <>
            <div className={"bg-red-100 rounded-xl p-3 ring ring-1 ring-red-200"} hidden={hidden}>
                <p className={"font-default-regular text-label-medium text-red-800"}>{messages.warnings.noToken}</p>
            </div>

        </>
    )

}