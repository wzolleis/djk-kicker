import EditGameForm from "~/components/game/admin/EditGameForm";
import DefaultButton from "~/components/common/buttons/DefaultButton";
import messages from "~/components/i18n/messages";
import DeleteButton from "~/components/common/buttons/status/DeleteButton";
import {ActionFunction, json, LoaderFunction, redirect} from "@remix-run/node";
import toast from "react-hot-toast";
import {deleteGame, findGameById, updateGame} from "~/models/admin.games.server";
import {Game} from "@prisma/client";
import {useLoaderData} from "@remix-run/react";
import {GameFromForm, getGameFromFormData} from "~/utils/game.server";
import {requireUserId} from "~/session.server";
import invariant from "tiny-invariant";
import {dateTimeLocalInputValueToDateTime} from "~/utils";
import routeLinks from "~/helpers/constants/routeLinks";


type LoaderData = {
    game: Game
}

export const loader: LoaderFunction = async ({params}) => {

    const gameId = params.gameId
    if (!gameId) {
        toast.error(`Game with id ${gameId} does not exist!`)
        return redirect("/application/admin/games")
    }
    const game = await findGameById(gameId);
    return json<LoaderData>({
        game
    })

}

export const action: ActionFunction = async ({params, request}) => {

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
            spielort: gameFromForm.location.toString()
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
    return (
        <EditGameForm game={game}>
            <div className={"flex items-center justify-end"}>
                <div className={"flex gap-2"}>
                    <DefaultButton>
                        <img className={"h-6"} src="/img/icons/check.png" alt=""/>
                        <button type={"submit"}
                                name={"intent"} value={"update"}>
                            {messages.adminEditGameForm.update}
                        </button>
                    </DefaultButton>
                    <DeleteButton>
                        <img className={"h-6"} src="/img/icons/delete.png" alt=""/>
                        <button type={"submit"}
                                name={"intent"} value={"delete"}>
                            {messages.adminEditGameForm.delete}
                        </button>
                    </DeleteButton>
                </div>
            </div>
        </EditGameForm>
    )
}

export default EditGame;
