import {Form, useLoaderData, useTransition} from "@remix-run/react";
import {findGameById, updateGameStatus} from "~/models/admin.games.server";
import {ActionFunction, json, LoaderFunction, redirect} from "@remix-run/node";
import invariant from "tiny-invariant";
import dateUtils from "~/dateUtils";
import messages from "~/components/i18n/messages";
import {getPlayers} from "~/models/player.server";
import routeLinks from "~/config/routeLinks";
import {useRef} from "react";
import mailhelper from '~/models/admin.games.mails.server'
import PlayerSelector from "~/components/game/forms/PlayerSelector";
import ContentContainer from "~/components/common/container/ContentContainer";
import SmallTag from "~/components/common/tags/SmallTag";
import DefaultButton from "~/components/common/buttons/DefaultButton";
import SuccessButton from "~/components/common/buttons/SuccessButton";
import {configuration} from "~/config";
import RedButton from "~/components/common/buttons/RedButton";

type LoaderData = {
    game: Awaited<ReturnType<typeof findGameById>>;
    players: Awaited<ReturnType<typeof getPlayers>>;
    hostName: string
};

export const loader: LoaderFunction = async ({request, params: {gameId}}) => {
    invariant(gameId, "Expected params.gameId");
    const hostName = request.headers.get("host")!
    const [game, players] = await Promise.all([findGameById(gameId), getPlayers()])
    return json<LoaderData>({game, players, hostName});
};


export const action: ActionFunction = async ({params: {gameId}, request}) => {
    invariant(gameId, "Expected params.gameId");
    const formData = await request.formData();
    const intent = formData.get("intent")
    const playerIds = formData.getAll("receiver") as string[]
    let redirectTarget = configuration.url.links.admin.gamesOverView

    if (intent === 'confirmation') {
        await Promise.all(
            [
                updateGameStatus(gameId, "Zusage"),
                mailhelper.sendGameZusage({gameId, playerIds})
            ]
        )
        redirectTarget = routeLinks.admin.game.details(gameId)
    }
    if (intent === "cancellation") {
        await Promise.all([
            updateGameStatus(gameId, "Absage"),
            mailhelper.sendGameAbsage({gameId, playerIds})
        ])
        redirectTarget = routeLinks.admin.game.details(gameId)
    }

    return redirect(redirectTarget)
}


const GameInvitation = () => {
    const {game, players} = useLoaderData<LoaderData>();
    const gameTime = dateUtils.format(new Date(game.gameTime));
    const transition = useTransition();
    const formRef = useRef<HTMLFormElement>(null);

    return (

        <>
            <div className="flex flex-col gap-2">
                <h1 className={"font-default-bold text-title-large"}>{messages.adminChangeStatusForm.title}</h1>

                <ContentContainer>
                    <div className={"flex flex-col justify-center items-start"}>
                        <p className={"font-default-bold text-title-large"}>{game.name}</p>
                        <div className={"flex gap-2"}>
                            <SmallTag text={gameTime}></SmallTag>
                            <SmallTag
                                text={messages.commonForm.spielort(game.spielort)}></SmallTag>
                        </div>
                    </div>
                </ContentContainer>
                <ContentContainer>
                    <Form ref={formRef} method="post">
                        <fieldset disabled={transition.state === "submitting"}>
                            <div className={"flex flex-col gap-2"}>
                                <PlayerSelector players={players}/>
                            </div>
                        </fieldset>
                        <div className={"grid grid-cols-2 md:flex gap-2 mt-5 justify-end"}>
                            <RedButton>
                                <img className={"h-6"} src="/img/icons/close-white.png" alt=""/>
                                <button
                                    type="submit"
                                    name="intent"
                                    value="cancel"
                                    disabled={transition.state === 'submitting'}
                                >
                                    {messages.commonForm.cancel}
                                </button>
                            </RedButton>
                            <DefaultButton>
                                <img className={"h-6"} src="/img/icons/mail-decline-white.png" alt=""/>
                                <button
                                    type="submit"
                                    name="intent"
                                    value="cancellation"
                                    disabled={transition.state === 'submitting'}
                                >
                                    {messages.adminGameAbsageForm.sendAbsageBtn}
                                </button>
                            </DefaultButton>
                            <SuccessButton>
                                <img className={"h-6"} src="/img/icons/mail-check-white.png" alt=""/>
                                <button
                                    type="submit"
                                    name="intent"
                                    value="confirmation"
                                    disabled={transition.state === 'submitting'}
                                >
                                    {messages.adminGameZusageForm.sendZusageBtn}
                                </button>
                            </SuccessButton>
                        </div>
                    </Form>
                </ContentContainer>
            </div>
        </>
    )


}

export default GameInvitation;