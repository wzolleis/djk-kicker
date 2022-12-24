import {useNavigate} from "@remix-run/react";
import {createGame} from "~/models/admin.games.server";
import messages from "~/components/i18n/messages";
import type {ActionFunction} from "@remix-run/node";
import {redirect} from "@remix-run/node";
import {requireUserId} from "~/session.server";
import invariant from "tiny-invariant";
import Modal from "~/components/common/modal/Modal";
import {useState} from "react";
import CreateGameForm from "~/components/game/forms/CreateGameForm";
import dateUtils from "~/dateUtils";
import routeLinks from "~/helpers/constants/routeLinks";

export const action: ActionFunction = async ({request}) => {
    const formData = await request.formData();
    const name = formData.get("name");
    const location = formData.get("location");
    const gameTimeTxt = formData.get("gameTime")?.toString() || "";
    const gameTime = dateUtils.dateTimeFromFormat({text: gameTimeTxt});

    const userId = await requireUserId(request);
    invariant(typeof userId === "string", "UserId must be a string");
    invariant(typeof name === "string", "name must be a string");
    invariant(!!userId, "UserId muss gesetzt sein");
    await createGame(gameTime, name, location!.toString());
    return redirect(routeLinks.games);
};

const NewGame = () => {
    const [showModal, setShowModal] = useState(true);
    const navigate = useNavigate();

    const closeModal = () => {
        setShowModal(false);
        navigate("/application/admin/games");
    };

    return (
        <>
            <Modal title={messages.adminCreateGameForm.newGame} show={showModal} onClose={closeModal}>
                <CreateGameForm></CreateGameForm>
            </Modal>
        </>
    );
};
export default NewGame;
