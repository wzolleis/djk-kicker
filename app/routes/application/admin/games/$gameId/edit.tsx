import EditGameForm from "~/components/game/admin/EditGameForm";
import DefaultButton from "~/components/common/buttons/DefaultButton";
import messages from "~/components/i18n/messages";
import {ActionFunction, json, LoaderFunction, redirect} from "@remix-run/node";
import toast from "react-hot-toast";
import {deleteGame, findGameById, updateGame} from "~/models/admin.games.server";
import {Game} from "@prisma/client";
import {useLoaderData, useNavigate} from "@remix-run/react";
import {GameFromForm, getGameFromFormData} from "~/utils/game.server";
import {requireUserId} from "~/session.server";
import invariant from "tiny-invariant";
import routeLinks from "~/helpers/constants/routeLinks";
import dateUtils from "~/dateUtils";
import RedButton from "~/components/common/buttons/RedButton";


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
    await requireUserId(request);
    const gameId = params.gameId!

    if (gameFromForm.intent === "update") {
        const game = await findGameById(gameId);
        invariant(!!game, `Spiel <${gameId}> existiert nicht`)
        const gameTime = dateUtils.dateTimeFromFormat({text: gameFromForm.gameTime}).toJSDate()
        const toUpdate: Game = {
            ...game,
            name: gameFromForm.name.toString(),
            gameTime,
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
    const navigate = useNavigate()
    const {game} = useLoaderData() as unknown as LoaderData
    return (
        <>
            <h1 className={"font-default-bold text-title-large"}>{messages.adminEditGameForm.title}</h1>
            <EditGameForm game={game}>
                <div className={"flex items-center gap-2"}>
                    <DefaultButton>
                        <p className={'fa fa-angle-left'}/>
                        <button type={"button"}
                                onClick={() => navigate(-1)}>
                            {messages.buttons.back}
                        </button>
                    </DefaultButton>
                    <RedButton className={'ml-auto'}>
                        <img className={"h-6"} src="/img/icons/delete.png" alt=""/>
                        <button type={"submit"}
                                name={"intent"} value={"delete"}>
                            {messages.adminEditGameForm.delete}
                        </button>
                    </RedButton>
                    <DefaultButton>
                        <img className={"h-6"} src="/img/icons/check.png" alt=""/>
                        <button type={"submit"}
                                name={"intent"} value={"update"}>
                            {messages.adminEditGameForm.update}
                        </button>
                    </DefaultButton>
                </div>
            </EditGameForm>
        </>
    )
}

export default EditGame;
