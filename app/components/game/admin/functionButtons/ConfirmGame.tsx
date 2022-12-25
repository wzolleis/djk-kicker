


import messages from "~/components/i18n/messages";

const ConfirmGame = () => {

    return (
        <>
            <button className={"rounded p-3 bg-green-400 text-white font-default-medium"} type={"submit"} name={"intent"} value={"confirm"}>
                {messages.adminEditGameForm.buttons.confirm}
            </button>
        </>
    )

}

export default ConfirmGame;