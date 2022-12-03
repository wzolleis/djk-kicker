import {Form, useNavigate, useTransition} from "@remix-run/react";
import {createGame} from "~/models/admin.games.server";
import messages from "~/components/i18n/messages";
import type {ActionFunction} from "@remix-run/node";
import {redirect} from "@remix-run/node";
import {requireUserId} from "~/session.server";
import invariant from "tiny-invariant";
import {dateTimeLocalInputValueToDateTime, dateTimeToDateTimeLocalInputFormValue} from "~/utils";
import {DateTime} from "luxon";
import Modal from "~/components/common/modal/Modal";
import {useState} from "react";
import CreateGameForm from "~/components/game/forms/CreateGameForm";

export const action: ActionFunction = async ({request}) => {
    const formData = await request.formData();
    const name = formData.get("name");
    const location = formData.get("location");
    const gameTime = formData.get("gameTime")!.toString()
    const userId = await requireUserId(request);
    invariant(typeof userId === "string", "UserId must be a string");
    invariant(typeof name === "string", "name must be a string");
    invariant(typeof gameTime === "string", "gameTime must be a string");
    invariant(!!userId, "UserId muss gesetzt sein");
    const game = await createGame(dateTimeLocalInputValueToDateTime(gameTime), name, location!.toString())
    return redirect("application/admin/games");
};

const defaultGameTime = (
    {hour, minute}: { hour: number; minute: number } = {hour: 20, minute: 0}
): string => {
    return dateTimeToDateTimeLocalInputFormValue(
        DateTime.now().set({
            hour,
            minute,
            millisecond: 0
        })
    );
};

const NewGame = () => {
    const transition = useTransition();
    const [showModal, setShowModal] = useState(true)
    const navigate = useNavigate();

    const closeModal = () => {
        setShowModal(false)
        navigate("/application/admin/games")
    }


    return (
        <>
            <Modal title={messages.adminCreateGameForm.newGame} show={showModal} onClose={() => closeModal()}>
                <CreateGameForm></CreateGameForm>
            </Modal>
        </>
    )
        ;
};
export default NewGame;