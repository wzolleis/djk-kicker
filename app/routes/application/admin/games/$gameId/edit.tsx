import DefaultButton from "~/components/common/buttons/DefaultButton";
import messages from "~/components/i18n/messages";
import {ActionFunction, json, LoaderFunction, redirect} from "@remix-run/node";
import {deleteGame, findGameById, updateGame} from "~/models/admin.games.server";
import {Game} from "@prisma/client";
import {Form, useLoaderData, useNavigate} from "@remix-run/react";
import {GameFromForm, getGameFromFormData} from "~/utils/game.server";
import {requireUserId} from "~/session.server";
import invariant from "tiny-invariant";
import routeLinks from "~/config/routeLinks";
import dateUtils from "~/dateUtils";
import RedButton from "~/components/common/buttons/RedButton";
import ContentContainer from "~/components/common/container/ContentContainer";
import InputWithLabel from "~/components/common/form/InputWithLabel";
import DateTimeInput from "~/components/common/datetime/datetime";
import {DateTime} from "luxon";
import SelectWithLabel from "~/components/common/form/SelectWithLabel";
import {configuration} from "~/config";


type LoaderData = {
    game: Game
}

export const loader: LoaderFunction = async ({params}) => {

    const gameId = params.gameId
    if (!gameId) {
        return redirect("/application/admin/games")
    }
    const game = await findGameById(gameId);
    return json<LoaderData>({game})
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
    } else if (gameFromForm.intent === "delete") {
        await deleteGame(gameId);
        return redirect(routeLinks.admin.games);
    }
}
const EditGame = () => {
    const navigate = useNavigate()
    const {game} = useLoaderData() as unknown as LoaderData

    return (
        <ContentContainer className={'bg-blue-200 mt-5'}>
            <h1 className={"font-default-bold text-title-large"}>{messages.adminEditGameForm.title}</h1>
            <Form method={"post"} className={"flex flex-col gap-2"}>
                <InputWithLabel id={"name"} type={"text"} name={"name"} label={messages.adminEditGameForm.name}
                                defaultValue={game.name}/>
                <DateTimeInput name="gameTime" defaultValue={DateTime.fromJSDate(new Date(game.gameTime))}/>
                <SelectWithLabel id={"location"} name={"location"}
                                 defaultValue={configuration.gameLocations[Number.parseInt(game.spielort)]}
                                 label={messages.adminEditGameForm.spielort}>
                    <option value={configuration.gameLocations.Halle}>
                        {messages.adminEditGameForm.optionHalle}
                    </option>
                    <option value={configuration.gameLocations.Draussen}>
                        {messages.adminEditGameForm.optionDraussen}</option>
                </SelectWithLabel>
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
            </Form>
        </ContentContainer>
    )
}

export default EditGame;
