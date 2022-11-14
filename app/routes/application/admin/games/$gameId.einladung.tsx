import {Form, useLoaderData, useTransition} from "@remix-run/react";
import {findGameById} from "~/models/admin.games.server";
import {json, LoaderFunction} from "@remix-run/node";
import invariant from "tiny-invariant";
import dateUtils from "~/dateUtils";
import messages from "~/components/i18n/messages";
import {getPlayers} from "~/models/player.server";
import {Player} from "@prisma/client";

type LoaderData = {
    game: Awaited<ReturnType<typeof findGameById>>;
    players: Awaited<ReturnType<typeof getPlayers>>;
};

export const loader: LoaderFunction = async ({params: {gameId}}) => {
    invariant(gameId, "Expected params.gameId");
    const [game, players] = await Promise.all([findGameById(gameId), getPlayers()])
    return json<LoaderData>({game, players});
};


const PlayerList = ({players}: { players: Player[]}) => {
    return (
        <div className="flex justify-center">
            <ul className="bg-white rounded-lg border border-gray-200 w-96 text-gray-900">
                {players.map(player => {
                    return (
                        <li key={player.id}
                            className="px-6 py-2 border-b border-gray-200 w-full rounded-t-lg">{player.name}</li>
                    )
                })}
            </ul>
        </div>
    )
}

const GameInvitation = () => {
    const {game, players} = useLoaderData<LoaderData>();
    const gameTime = dateUtils.format(new Date(game.gameTime));
    const transition = useTransition();

    return (
        <div className="mb-6 grid gap-6 bg-gray-300 px-4 md:grid-cols-2">
            <div className="pt-2 font-poppins-semibold md:col-span-2">
                <p>
                    <span className="text-gray-500">{messages.adminGameInvitationForm.titleGame}</span>
                    <span className="pl-2 font-poppins-bold">{gameTime}</span>
                </p>
                <p>
                    <span className="text-gray-500">{messages.adminGameInvitationForm.titleGameTime}</span>
                    <span
                        className="pl-2 font-poppins-bold">{messages.adminGameInvitationForm.spielort(game.spielort)}</span>
                </p>
            </div>
            <Form>
                <fieldset disabled={transition.state === "submitting"}>
                    <div>
                        <label
                            htmlFor="player"
                            className="mb-2 block text-sm font-medium text-gray-900"
                        >
                            {messages.adminGameInvitationForm.player}
                        </label>
                        <PlayerList players={players}/>
                    </div>
                    <div>
                        <label
                            htmlFor="mailBody"
                            className="mb-2 block text-sm font-medium text-gray-900"
                        >
                            {messages.adminGameInvitationForm.mailBody}
                        </label>
                        <textarea id="mailBody"
                                  name="mailBody"
                                  rows={4}
                                  required={true}
                                  className="block w-full rounded-lg border border-2 border-gray-600 p-2.5 text-sm placeholder-gray-400 focus:border-blue-500"
                                  defaultValue={"Blablabla"}
                        >
                        </textarea>
                    </div>
                </fieldset>
                <div className={"flex justify-start gap-2 pt-2"}>
                    <button
                        type="submit"
                        className="rounded mb-2 mt-2 bg-gray-800 py-2 px-2 text-white hover:bg-gray-600 focus:border-2 disabled:bg-gray-300"
                        name="intent"
                        value="feedback"
                        disabled={transition.state === 'submitting'}
                    >
                        {messages.commonForm.cancel}
                    </button>
                    <button
                        type="submit"
                        className="rounded mb-2 mt-2 ml-auto bg-amber-600 py-2 px-2 text-white hover:bg-amber-600 focus:border-2 disabled:bg-amber-300"
                        name="intent"
                        value="feedback"
                        disabled={transition.state === 'submitting'}
                    >
                        Einladung verschicken
                    </button>
                </div>
            </Form>
        </div>
    )


}

export default GameInvitation