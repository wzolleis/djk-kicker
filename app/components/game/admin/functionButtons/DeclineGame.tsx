


import messages from "~/components/i18n/messages";

const DeclineGame = () => {

    return (
        <>
            <button className={"rounded p-3 bg-red-400 text-white font-poppins-medium"} type={"submit"} name={"intent"} value={"decline"}>
                {messages.adminEditGameForm.buttons.decline}
            </button>
        </>
    )

}

export default DeclineGame;