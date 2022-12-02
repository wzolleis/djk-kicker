import {Form, useLoaderData, useTransition} from "@remix-run/react";
import {findGameById} from "~/models/admin.games.server";
import {ActionFunction, json, LoaderFunction, redirect} from "@remix-run/node";
import invariant from "tiny-invariant";
import dateUtils from "~/dateUtils";
import messages from "~/components/i18n/messages";
import {getPlayers} from "~/models/player.server";
import {Player} from "@prisma/client";
import routeLinks from "~/helpers/constants/routeLinks";
import {useRef} from "react";
import mailhelper from '~/models/admin.games.mails.server'
import mailLinkBuilder from "~/helpers/mail/mailLinkBuilder";

type LoaderData = {
    game: Awaited<ReturnType<typeof findGameById>>;
    players: Awaited<ReturnType<typeof getPlayers>>;
    hostName: string
};

export const loader: LoaderFunction = async ({params: {gameId}}) => {
    invariant(gameId, "Expected params.gameId");

    const hostName = process.env.HOSTNAME || 'djk-kicker.netlify.app'
    const [game, players] = await Promise.all([findGameById(gameId), getPlayers()])
    return json<LoaderData>({game, players, hostName});
};


export const action: ActionFunction = async ({params: {gameId}, request}) => {
    invariant(gameId, "Expected params.gameId");
    const formData = await request.formData();
    const intent = formData.get("intent")

    if (intent === 'einladung') {
        const host = process.env.HOSTNAME || ''
        const playerIds = formData.getAll("receiver") as string[]
        invariant(!!host)
        await mailhelper.sendGameInvitation({host, gameId, playerIds})
        return redirect(routeLinks.admin.game.details(gameId));
    }

    return redirect(routeLinks.admin.game.details(gameId))
}

const PlayerList = ({players}: { players: Player[] }) => {

    return (
        <div className="flex md:flex-row gap-2 justify-start flex-wrap mb-2">
            {
                players.map((player) => {
                    return (
                        <div key={player.id}>
                            <input
                                type="checkbox"
                                defaultChecked={false}
                                id={player.email}
                                name={'receiver'}
                                className="form-checkbox"
                                value={player.id}
                            />
                            <label className="form-check-label inline-block text-gray-800" htmlFor="receiver">
                                <span
                                    className="pl-1 font-poppins-semibold text-sm md:text-xl">{`${player.name}`}</span>
                                <span
                                    className="font-poppins-medium text-gray-500 text-sm md:text-xl pl-2 hidden md:inline">{`(${player.email})`}</span>
                            </label>
                        </div>
                    )
                })
            }
        </div>
    )
}

const GameInvitation = () => {
    const {game, players, hostName} = useLoaderData<LoaderData>();
    const gameTime = dateUtils.format(new Date(game.gameTime));
    const transition = useTransition();
    const formRef = useRef<HTMLFormElement>(null);

    const invitationLink = mailLinkBuilder.gameInvitationLink({host: hostName, gameId: game.id, token: game.token})

    return (
        <div className="mb-6 grid gap-6 bg-gray-300 px-4 md:grid-cols-2">
            <div className="pt-1 font-poppins-semibold md:col-span-2">
                <p>
                    <span
                        className="text-gray-500 text-sm md:text-xl">{messages.adminGameInvitationForm.titleGame}
                    </span>
                    <span className="pl-2 font-poppins-bold ">{gameTime}</span>
                </p>
                <p>
                    <span
                        className="text-gray-500 text-sm md:text-xl">{messages.adminGameInvitationForm.titleGameTime}
                    </span>
                    <span
                        className="pl-2 font-poppins-bold">{messages.adminGameInvitationForm.spielort(game.spielort)}
                    </span>
                </p>
            </div>
            <Form ref={formRef} method="post">
                <fieldset disabled={transition.state === "submitting"}>
                    <div className="col-span-2">
                        <label
                            htmlFor="player"
                            className="mb-2 block font-poppins-bold text-gray-900"
                        >
                            {messages.adminGameInvitationForm.mailReceiver}
                        </label>
                        <PlayerList players={players}/>
                    </div>
                    <div>
                        <label
                            htmlFor="einladungsLink"
                            className="mb-2 pt-3 block font-poppins-bold text-gray-900"
                        >
                            {messages.adminGameInvitationForm.invitationLink}
                        </label>
                        <input
                            id="einladungslink"
                            name="einladungslink"
                            className="block w-full rounded-lg border border-2 border-gray-600 p-2.5 text-sm placeholder-gray-400 focus:border-blue-500 disabled:bg-amber-100"
                            defaultValue={invitationLink}
                            disabled={true}
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="einladungsLink"
                            className="mb-2 pt-3 block font-poppins-bold text-gray-900"
                        >
                            {messages.adminGameInvitationForm.mailSubjectLabel}
                        </label>
                        <input
                            id="einladungslink"
                            name="einladungslink"
                            className="block w-full rounded-lg border border-2 border-gray-600 p-2.5 text-sm placeholder-gray-400 focus:border-blue-500 disabled:bg-amber-100"
                            defaultValue={messages.mailContent.invitationMail.mailSubject(gameTime)}
                            disabled={true}
                        />
                    </div>
                </fieldset>
                <div className={"flex justify-start gap-2 pt-2"}>
                    <button
                        type="submit"
                        className="rounded mb-2 mt-2 bg-gray-800 py-2 px-2 text-white hover:bg-gray-600 focus:border-2 disabled:bg-gray-300"
                        name="intent"
                        value="cancel"
                        disabled={transition.state === 'submitting'}
                    >
                        {messages.commonForm.cancel}
                    </button>
                    <button
                        type="submit"
                        className="rounded mb-2 mt-2 ml-auto bg-blue-600 py-2 px-2 text-white hover:bg-blue-400 focus:border-2 disabled:bg-blue-200"
                        name="intent"
                        value="einladung"
                        disabled={transition.state === 'submitting'}
                    >
                        {messages.adminGameInvitationForm.sendInvitationBtn}
                    </button>
                </div>
            </Form>
        </div>
    )


}

export default GameInvitation