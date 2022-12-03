import {Form, useLoaderData, useTransition} from "@remix-run/react";
import {findGameById} from "~/models/admin.games.server";
import {ActionFunction, json, LoaderFunction, redirect} from "@remix-run/node";
import invariant from "tiny-invariant";
import dateUtils from "~/dateUtils";
import messages from "~/components/i18n/messages";
import {getPlayers} from "~/models/player.server";
import routeLinks from "~/helpers/constants/routeLinks";
import {useRef} from "react";
import mailhelper from '~/models/admin.games.mails.server'
import mailLinkBuilder from "~/helpers/mail/mailLinkBuilder";
import PlayerSelector from "~/components/game/forms/PlayerSelector";
import ContentContainer from "~/components/common/container/ContentContainer";
import SmallTag from "~/components/common/tags/SmallTag";
import InputWithLabel from "~/components/common/form/InputWithLabel";
import DefaultButton from "~/components/common/buttons/DefaultButton";
import DeleteButton from "~/components/common/buttons/status/DeleteButton";
import {config} from "~/components/i18n/config";

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
    if (intent === 'invitation') {
        const host = request.headers.get("host")!;
        const playerIds = formData.getAll("receiver") as string[]
        await mailhelper.sendGameInvitation({host, gameId, playerIds})
        return redirect(routeLinks.admin.game.details(gameId));
    }

    return redirect(config.url.links.admin.gamesOverView)
}

const GameInvitation = () => {
    const {game, players, hostName} = useLoaderData<LoaderData>();
    const gameTime = dateUtils.format(new Date(game.gameTime));
    const transition = useTransition();
    const formRef = useRef<HTMLFormElement>(null);

    const invitationLink = mailLinkBuilder.gameInvitationLink({host: hostName, gameId: game.id, token: game.token})

    return (

        <>
            <div className="flex flex-col gap-2">
                <h1 className={"font-default-bold text-title-large"}>{messages.adminSendInvitationForm.title}</h1>

                <ContentContainer>
                    <div className={"flex flex-col justify-center items-start"}>
                        <p className={"font-default-bold text-title-large"}>{game.name}</p>
                        <div className={"flex gap-2"}>
                            <SmallTag text={gameTime}></SmallTag>
                            <SmallTag
                                text={config.gameLocations[game.spielort as unknown as number]}></SmallTag>
                        </div>
                    </div>
                </ContentContainer>
                <ContentContainer>
                    <Form ref={formRef} method="post">
                        <fieldset disabled={transition.state === "submitting"}>
                            <div className={"flex flex-col gap-2"}>
                                <PlayerSelector players={players}/>
                                <InputWithLabel id={"invitationLink"} type={"text"} name={"invitationLink"}
                                                label={messages.adminGameInvitationForm.invitationLink}
                                                defaultValue={invitationLink}/>
                                <InputWithLabel id={"emailSubject"} type={"text"} name={"emailSubject"}
                                                label={messages.adminGameInvitationForm.mailSubjectLabel}
                                                defaultValue={messages.mailContent.invitationMail.mailSubject(gameTime)}/>
                            </div>
                        </fieldset>
                        <div className={"flex gap-2 mt-5 justify-end"}>
                            <DeleteButton>
                                <img className={"h-6"} src="/img/icons/close-white.png" alt=""/>
                                <button
                                    type="submit"
                                    name="intent"
                                    value="cancel"
                                    disabled={transition.state === 'submitting'}
                                >
                                    {messages.commonForm.cancel}
                                </button>
                            </DeleteButton>
                            <DefaultButton>
                                <img className={"h-6"} src="/img/icons/mail-check-white.png" alt=""/>
                                <button
                                    type="submit"
                                    name="intent"
                                    value="invitation"
                                    disabled={transition.state === 'submitting'}
                                >
                                    {messages.adminGameInvitationForm.sendInvitationBtn}
                                </button>
                            </DefaultButton>
                        </div>
                    </Form>
                </ContentContainer>
            </div>
        </>
    )


}

export default GameInvitation;