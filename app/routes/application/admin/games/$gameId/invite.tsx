import {Form, useFetcher, useLoaderData, useTransition,} from "@remix-run/react";
import {findGameById, updateGameStatus} from "~/models/admin.games.server";
import {ActionFunction, json, LoaderFunction, redirect,} from "@remix-run/node";
import invariant from "tiny-invariant";
import dateUtils from "~/dateUtils";
import messages from "~/components/i18n/messages";
import {getPlayers} from "~/models/player.server";
import routeLinks from "~/config/routeLinks";
import {BaseSyntheticEvent, useEffect, useRef, useState} from "react";
import mailhelper from "~/models/admin.games.mails.server";
import PlayerSelector from "~/components/game/forms/PlayerSelector";
import ContentContainer from "~/components/common/container/ContentContainer";
import SmallTag from "~/components/common/tags/SmallTag";
import InputWithLabel from "~/components/common/form/InputWithLabel";
import DefaultButton from "~/components/common/buttons/DefaultButton";
import {configuration} from "~/config";
import RedButton from "~/components/common/buttons/RedButton";
import SelectWithLabel from "~/components/common/form/SelectWithLabel";
import {prisma} from "~/db.server";
import mailLinkBuilder from "~/helpers/mail/mailLinkBuilder";
import {mailContent} from "~/components/i18n/mailcontent";
import {Feedback} from "@prisma/client";
import {createEncryptedPlayerToken} from "~/utils/token.server";
import SubmitButton from "~/components/common/buttons/submitButton";

type LoaderData = {
    game: Awaited<ReturnType<typeof findGameById>>;
    players: Awaited<ReturnType<typeof getPlayers>>;
    hostName: string;
};

type RequestPlayerLink = {
    feedback: Feedback;
    playerToken: string;
};

export const loader: LoaderFunction = async ({
                                                 request,
                                                 params: {gameId},
                                             }) => {
    invariant(gameId, "Expected params.gameId");
    const url = new URL(request.url);
    const hostName = request.headers.get("host")!;
    const [game, players] = await Promise.all([
        findGameById(gameId),
        getPlayers(),
    ]);
    if (url.searchParams.get("player")) {
        const playerId = url.searchParams.get("player")!;
        const feedback = await prisma.feedback.findFirstOrThrow({
            where: {
                gameId: gameId,
                playerId,
            },
        });
        const playerToken = await createEncryptedPlayerToken(playerId, gameId);
        return json<RequestPlayerLink>({feedback, playerToken});
    }

    return json<LoaderData>({game, players, hostName});
};

export const action: ActionFunction = async ({
                                                 params: {gameId},
                                                 request,
                                             }) => {
    invariant(gameId, "Expected params.gameId");
    const formData = await request.formData();
    const intent = formData.get("intent");
    if (intent === "invitation") {
        const host = request.headers.get("host")!;
        const playerIds = formData.getAll("receiver") as string[];
        mailhelper.sendGameInvitation({host, gameId, playerIds})
            .then(() => updateGameStatus(gameId, "Einladung"))
    }
    return redirect(routeLinks.admin.game.details(gameId));
};

const GameInvitation = () => {
    const {game, players, hostName} = useLoaderData<LoaderData>();
    const gameTime = dateUtils.format(new Date(game.gameTime));
    const transition = useTransition();
    const formRef = useRef<HTMLFormElement>(null);
    const playerToken = useFetcher<RequestPlayerLink>();
    const [invitationLink, setInvitationLink] = useState("initLink");
    useEffect(() => {
        if (playerToken.type === "init") {
            const playerId = players[0].id;
            playerToken.submit({player: playerId,}, {method: "get",});
        }
        if (playerToken.data?.playerToken) {
            setInvitationLink(() =>
                mailLinkBuilder.gameInvitationLink({
                    host: hostName,
                    gameId: game.id,
                    token: playerToken.data!.playerToken,
                })
            );
        }
    }, [playerToken.data?.playerToken]);

    return (
        <>
            <div className="flex w-full flex-col gap-2">
                <h1 className={"font-default-bold text-title-large"}>
                    {messages.adminSendInvitationForm.title}
                </h1>

                <ContentContainer>
                    <div className={"flex flex-col items-start justify-center"}>
                        <p className={"font-default-bold text-title-large"}>
                            {game.name}
                        </p>
                        <div className={"flex gap-2"}>
                            <SmallTag text={gameTime}/>
                            <SmallTag text={configuration.gameLocations[game.spielort as unknown as number]}/>
                        </div>
                    </div>
                </ContentContainer>
                <ContentContainer>
                    <Form ref={formRef} method="post">
                        <fieldset disabled={transition.state === "submitting"}>
                            <div className={"flex flex-col gap-2"}>
                                <PlayerSelector players={players}/>
                                <playerToken.Form method="get">
                                    <SelectWithLabel
                                        id={"player"}
                                        name={"player"}
                                        onChange={(
                                            event: BaseSyntheticEvent
                                        ) => {
                                            playerToken.submit(event.target.form);
                                        }}
                                        label={"Spieler"}>
                                        {players.map((player) => (
                                            <option key={player.id} value={player.id}>{player.name}</option>
                                        ))}
                                    </SelectWithLabel>
                                </playerToken.Form>
                                <label
                                    className={"font-default-medium text-gray-600"}>
                                    {messages.adminGameInvitationForm.invitationLink}
                                </label>
                                <div className={"flex gap-2"}>
                                    <div
                                        onClick={async () => {
                                            await navigator.clipboard.writeText(invitationLink);
                                        }}>
                                        <DefaultButton>Kopieren</DefaultButton>
                                    </div>
                                </div>
                                <InputWithLabel
                                    id={"emailSubject"}
                                    type={"text"}
                                    name={"emailSubject"}
                                    label={messages.adminGameInvitationForm.mailSubjectLabel}
                                    defaultValue={mailContent.invitationMail.mailSubject(gameTime)}
                                />
                            </div>
                        </fieldset>
                        <div className={"mt-5 grid grid-cols-2 justify-end gap-2 md:flex"}>
                            <RedButton>
                                <img
                                    className={"h-6"}
                                    src="/img/icons/close-white.png"
                                    alt=""
                                />
                                <button
                                    type="submit"
                                    name="intent"
                                    value="cancel"
                                    disabled={
                                        transition.state === "submitting"
                                    }>
                                    {messages.commonForm.cancel}
                                </button>
                            </RedButton>
                            <DefaultButton>
                                <img
                                    className={"h-6"}
                                    src="/img/icons/mail-check-white.png"
                                    alt=""
                                />
                                <SubmitButton label={messages.adminGameInvitationForm.sendInvitationBtn}
                                              loadingLabel={messages.adminGameInvitationForm.sendInvitationBtn}
                                              name={"intent"}
                                              value={"invitation"}
                                />
                            </DefaultButton>
                        </div>
                    </Form>
                </ContentContainer>
            </div>
        </>
    );
};

export default GameInvitation;
