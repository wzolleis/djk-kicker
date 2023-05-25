import {Form, useActionData, useLoaderData} from "@remix-run/react";
import {ActionFunction, json, redirect} from "@remix-run/node";
import {getQueryParams} from "~/utils";
import PageHeader from "~/components/common/PageHeader";
import messages from "~/components/i18n/messages";
import {createPlayer, getPlayerByMail} from "~/models/player.server";
import {createFeedback} from "~/models/feedback.server";
import invariant from "tiny-invariant";
import routeLinks from "~/config/routeLinks";
import {getGameById} from "~/models/games.server";
import {GameWithFeedback} from "~/config/applicationTypes";
import TransitionContainer from "~/components/common/container/transitionContainer";
import ContentContainer from "~/components/common/container/ContentContainer";
import * as React from "react";
import {useState} from "react";
import {statusInConfig} from "~/config/status";
import InputWithLabel from "~/components/common/form/InputWithLabel";
import SetStatusButton from "~/components/common/buttons/SetStatusButton";
import {configuration} from "~/config";
import RedButton from "~/components/common/buttons/RedButton";
import DefaultButton from "~/components/common/buttons/DefaultButton";
import {MailService} from "~/helpers/mail/mailService";
import {getPlayerToken} from "~/models/token.server";
import {createDefaultRating} from "~/models/playerRating.server";

type LoaderData = {
    gameId: string;
    game?: GameWithFeedback
};

export const loader = async ({request}: { params: any; request: any }) => {
    const {gameid} = getQueryParams(request, "gameid");
    if (!!gameid) {
        const game: GameWithFeedback | null = await getGameById(gameid)
        const gameWithFeedback = game ?? undefined
        return json({gameId: gameid, game: gameWithFeedback});
    }

    return json({gameId: gameid});
};

const sendGameInvitation = async ({
                                      request,
                                      gameId,
                                      playerId
                                  }: { request: Request, gameId: string, playerId: string }) => {
    const host = request.headers.get("host")!;
    const mailservice = new MailService(gameId, 'gameInvitation', [playerId], '', '', host)
    await mailservice.sendGameMail()
}

type ActionData = {
    error: {
        playerMail: string | null
        playerStatus: string | null
        playerNote: string | null
    } | undefined,
    info: {
        created: {
            playerId: string
        }
    } | undefined
}

export const action: ActionFunction = async ({
                                                 request,
                                             }: {
    request: Request;
}) => {
    const formData = await request.formData();
    const {gameid} = getQueryParams(request, "gameid");

    const playerName = formData.get("name");
    const playerMail = formData.get("mail");
    const playerStatus = formData.get("status");
    const intent = formData.get("intent");
    const note = formData.get("note");

    invariant(typeof intent === "string", "intent");
    invariant(typeof playerName === "string", "name");
    invariant(typeof playerMail === "string", "mail");

    let redirectTarget = routeLinks.dashboard

    console.group('create player')

    try {
        if (intent === "cancel") {
            console.info('cancel')
            redirectTarget = gameid ? routeLinks.game(gameid) : routeLinks.dashboard
        } else {
            console.info('validate  mail')
            const emptyError = {
                playerStatus: null,
                playerMail: null,
                playerNote: null
            }

            const playerByMail = await getPlayerByMail(playerMail)
            if (playerByMail !== null) {
                console.info('Die Mail ' + playerByMail.email + ' existiert bereits')
                return json({
                    error: {
                        ...emptyError,
                        playerMail: 'Es gibt schon einen Spieler mit der Mailadresse',
                    }
                })
            }
            console.info('create player')
            const player = await createPlayer(playerName.trim(), playerMail.trim());

            console.info('create default rating...')
            await createDefaultRating(player.id)
            console.info('...default rating created')

            console.info('create token....')
            await getPlayerToken(player.id, false)
            console.info('...token created')

            if (!!gameid) {
                console.info('validate input')
                if (typeof playerStatus !== "string") {
                    return json({
                        error: {
                            ...emptyError,
                            playerStatus: 'Status ist ungültig'
                        }
                    })
                }

                if (typeof note !== 'string') {
                    return json({
                        error: {
                            emptyError,
                            playerNote: 'Note ist ungültig'
                        }
                    })
                }

                console.info('create feedback')
                await createFeedback({playerId: player.id, gameId: gameid, status: parseInt(playerStatus), note});
                console.info('sending invitation...')
                await sendGameInvitation({request, gameId: gameid, playerId: player.id})
                console.info('...invitation sent')
                console.info('Neuer Spieler wurde angelegt')
                redirectTarget = routeLinks.game(gameid);
            }
        }
        return redirect(redirectTarget)
    } finally {
        console.info('create player - end')
        console.groupEnd()
    }
};

const CreatePlayer = () => {
    const {gameId} = useLoaderData<LoaderData>() as unknown as LoaderData;
    const actionData = useActionData<ActionData>() as unknown as ActionData;
    const [status, setStatus] = useState<statusInConfig>(statusInConfig.unknown);
    return (
        <TransitionContainer>
            <ContentContainer className={"mt-2.5 shadow-lg shadow-blue-400/50"}>
                <PageHeader title={messages.player.add}></PageHeader>
                <Form method={"post"}>
                    <main className={"flex flex-col gap-4"}>
                        <InputWithLabel id={'name'} type={'text'} name={'name'} label={messages.createPlayerForm.name} required={true}/>
                        <InputWithLabel id={'mail'} type={'email'} name={'mail'} label={messages.createPlayerForm.email} required={true}
                                        error={actionData?.error?.playerMail}/>
                        {!!gameId &&
                            <>
                                <div className={"flex flex-col font-default-medium text-slate-600"}>
                                    <label htmlFor="name">{messages.createPlayerForm.status}</label>
                                    <div>
                                        <input
                                            name={"status"}
                                            id={"status"}
                                            type={"hidden"}
                                            defaultValue={status}
                                        />
                                        <div className={"mt-5 flex w-full items-center justify-start gap-5"}>
                                            <SetStatusButton
                                                image={"/img/thumbs-up.png"}
                                                onClick={() => setStatus(configuration.status.confirmed)}
                                                isActive={status === configuration.status.confirmed}
                                                activeColor={"green-500"}
                                            />
                                            <SetStatusButton
                                                image={"/img/thumbs-down.png"}
                                                onClick={() => setStatus(configuration.status.declined)}
                                                isActive={status === configuration.status.declined}
                                                activeColor={"red-500"}
                                            />
                                            <SetStatusButton
                                                image={"/img/thinking.png"}
                                                onClick={() => setStatus(configuration.status.undecided)}
                                                isActive={status === configuration.status.undecided}
                                                activeColor={"yellow-500"}
                                            />
                                        </div>
                                        {actionData?.error?.playerStatus && (
                                            <div className="pt-1 text-red-700 bg-yellow-500">
                                                {actionData.error.playerStatus}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className={"flex flex-col font-inter-medium text-slate-600"}>
                                    <label htmlFor={"feedbackNote"}>Notiz</label>
                                    <textarea
                                        name={"note"}
                                        id={"note"}
                                        className={"rounded-xl border border-gray-300 bg-white py-3 shadow-lg shadow-indigo-500/20 outline-none"}/>
                                    {actionData?.error?.playerNote && (
                                        <div className="pt-1 text-red-700 bg-yellow-500">
                                            {actionData.error.playerNote}
                                        </div>
                                    )}
                                </div>
                            </>
                        }
                        <div className={"flex justify-start gap-2 pt-2"}>
                            <RedButton>
                                <button name='intent' value={'cancel'} type={'submit'}>{messages.buttons.cancel}</button>
                            </RedButton>
                            <DefaultButton className={'ml-auto'}>
                                <button name={'intent'} value={'save'}>{messages.buttons.save}</button>
                            </DefaultButton>
                        </div>
                    </main>
                </Form>
            </ContentContainer>
        </TransitionContainer>
    );
};

export default CreatePlayer;
