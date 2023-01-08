import {Form, useFetcher, useNavigate} from "@remix-run/react";
import {deleteExpiredGames, findAllGames, findExpiredGames} from "~/models/admin.games.server";
import {ActionFunction, json, LoaderArgs, redirect} from "@remix-run/node";
import {requireUserId} from "~/session.server";
import {useDateTime} from "~/utils";
import messages from "~/components/i18n/messages";
import {useEffect} from "react";
import routeLinks from "~/config/routeLinks";
import {ExclamationTriangleIcon} from "@heroicons/react/24/solid";
import ButtonContainer from "~/components/common/container/ButtonContainer";
import DefaultButton from "~/components/common/buttons/DefaultButton";
import RedButton from "~/components/common/buttons/RedButton";
import {Params} from "react-router";
import invariant from "tiny-invariant";

type LoaderData = {
    games: Awaited<ReturnType<typeof findAllGames>>;
};

export const loader = async ({request}: LoaderArgs) => {
    await requireUserId(request);
    const games = await findExpiredGames();
    return json<LoaderData>({games});
};

export const action: ActionFunction = async ({request}: { params: Params, request: Request }) => {
    const formData = await request.formData();
    const intent = formData.get('intent')
    invariant(!!intent, "Kein Intent gesetzt")

    if (intent === 'abort') {
        return redirect(routeLinks.admin.games)
    } else if (intent === 'delete') {
        await deleteExpiredGames()
    }
    return redirect(routeLinks.admin.games)
}

const DeleteExpiredGames = () => {
    const fetcher = useFetcher<LoaderData>();
    const navigate = useNavigate()

    useEffect(() => {
        if (fetcher.type === "init") {
            fetcher.load(routeLinks.admin.deleteExpiredGames);
        }
    }, [fetcher]);

    const games = fetcher.data?.games

    if (!games || games.length === 0) return (
        <>
            <div className="flex flex-col bg-red-100 rounded-lg p-4 mb-4 text-sm text-red-700" role="alert">
                <p>Keine Spiele gefunden</p>
            </div>
            <ButtonContainer className={'pt-5'}>
                <DefaultButton>
                    <p className={'fa fa-angle-left'}/>
                    <button type={"button"}
                            onClick={() => navigate(-1)}>
                        {messages.buttons.back}
                    </button>
                </DefaultButton>
            </ButtonContainer>
        </>
    )

    return (
        <Form method={'post'}>
            <div className="flex flex-col bg-red-100 rounded-lg p-4 mb-4 text-sm text-red-700" role="alert">
                <div>
                    <ExclamationTriangleIcon className="w-10 h-10 inline mr-3 mb-3" fill="currentColor"/>
                    <span
                        className="text-lg">{messages.adminDeleteExpiredForm.confirmationQuestion(games.length)}</span>
                    <div className={'flex grid grid-col-2 md:grid-cols-6 gap-2 md:gap-5'}>
                        {games.map((game) => {
                            return (
                                <div
                                    className="p-3 mb-4 rounded-lg border border-gray-100 bg-gray-800 border-gray-700">
                                    <time
                                        className="text-sm font-semibold text-white">{useDateTime(new Date(game.gameTime))}</time>
                                </div>
                            )
                        })}
                    </div>

                </div>
                <ButtonContainer className={'pt-5'}>
                    <DefaultButton className={'mr-5'}>
                        <button name={'intent'} value={'abort'} type={'submit'}>{messages.buttons.cancel}</button>
                    </DefaultButton>
                    <RedButton>
                        <button type={'submit'} name={'intent'} value={'delete'}>{messages.buttons.delete}</button>
                    </RedButton>
                </ButtonContainer>
            </div>
        </Form>

    )

}

export default DeleteExpiredGames