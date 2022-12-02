import {useState} from "react";
import Modal from "~/components/common/modal/Modal";
import messages from "~/components/i18n/messages";
import EditGameForm from "~/components/game/admin/EditGameForm";
import type {Game} from "@prisma/client";
import type {ActionFunction, LoaderFunction} from "@remix-run/node";
import {json, redirect} from "@remix-run/node";
import {findGameById} from "~/models/games.server";
import {useLoaderData} from "@remix-run/react";
import invariant from "tiny-invariant";
import InviteToGame from "~/components/game/admin/functionButtons/InviteToGame";
import ConfirmGame from "~/components/game/admin/functionButtons/ConfirmGame";
import DeclineGame from "~/components/game/admin/functionButtons/DeclineGame";
import DefaultButton from "~/components/common/buttons/DefaultButton";
import DeleteButton from "~/components/common/buttons/status/DeleteButton";
import {GameFromForm, getGameFromFormData} from "~/utils/game.server";
import routeLinks from "~/helpers/constants/routeLinks";
import {dateTimeLocalInputValueToDateTime} from "~/utils";
import {deleteGame, updateGame} from "~/models/admin.games.server";
import {requireUserId} from "~/session.server";

type LoaderData = {
    game: Game;
}

export const loader: LoaderFunction = async ({params, request}) => {
    invariant(params.gameId, "Help")
    const gameId = params.gameId!
    const game = await findGameById(gameId);
    if (!game) {
        return redirect("/application/games")
    }
    return json<LoaderData>({game})
}


export const action: ActionFunction = async ({params, request}) => {

    console.log("action received");
    const formData = await request.formData();
    const gameFromForm: GameFromForm = getGameFromFormData(formData);
    const userId = await requireUserId(request);
    const gameId = params.gameId!

    if (gameFromForm.intent === "update") {
        const game = await findGameById(gameId);
        invariant(!!game, `Spiel <${gameId}> existiert nicht`)
        const toUpdate: Game = {
            ...game,
            name: gameFromForm.name.toString(),
            gameTime: dateTimeLocalInputValueToDateTime(gameFromForm.gameTime.toString()).toJSDate(),
            spielort: "0"
        };
        await updateGame(toUpdate)
        return redirect(routeLinks.admin.games);
    } else if (gameFromForm.intent === "invite") {
        return redirect(routeLinks.admin.game.invitation(params.gameId!))

    } else if (gameFromForm.intent === "delete") {
        await deleteGame(gameId);
        return redirect(routeLinks.admin.games);
    }
}


const EditGame = () => {
    const {game} = useLoaderData() as unknown as LoaderData
    const [showModal, setShowModal] = useState(true);

    const toggleModal = () => {
        setShowModal(!showModal)
    }
    return (
        <>

                <Modal title={messages.adminEditGameForm.title} show={showModal} onClose={() => toggleModal}>
                    <EditGameForm game={game}>
                        <div className={"flex items-center justify-between"}>
                            <div className={"flex gap-3"}>
                                <ConfirmGame/>
                                <DeclineGame/>
                                <InviteToGame/>
                            </div>
                            <div className={"flex gap-2"}>
                                <DefaultButton>
                                    <button type={"submit"}
                                            name={"intent"} value={"update"}>
                                        {messages.adminEditGameForm.update}
                                    </button>
                                </DefaultButton>
                                <DeleteButton>
                                    <button type={"submit"}
                                            name={"intent"} value={"delete"}>
                                        {messages.adminEditGameForm.delete}
                                    </button>
                                </DeleteButton>
                            </div>
                        </div>
                    </EditGameForm>
                </Modal>
            </>
            )
            }

            export default EditGame;