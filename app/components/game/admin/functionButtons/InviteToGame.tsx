import messages from "~/components/i18n/messages";

const InviteToGame = () => {

    return (
        <>
            <button className={"rounded p-3 bg-yellow-400 text-white font-default-medium"} type={"submit"} name={"intent"} value={"invite"}>
                {messages.adminEditGameForm.buttons.invite}
            </button>
        </>
    )

}

export default InviteToGame;