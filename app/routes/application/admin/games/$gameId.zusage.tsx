import {Form, useLoaderData, useTransition} from "@remix-run/react";
import {findGameById} from "~/models/admin.games.server";
import {ActionFunction, json, LoaderFunction, redirect} from "@remix-run/node";
import invariant from "tiny-invariant";
import dateUtils from "~/dateUtils";
import messages from "~/components/i18n/messages";
import {getPlayersWithUniqueFeedbackForGame} from "~/models/player.server";
import {Player} from "@prisma/client";
import routeLinks from "~/helpers/constants/routeLinks";
import {useRef} from "react";
import mailhelper from '~/models/admin.games.mails.server'

type LoaderData = {
    game: Awaited<ReturnType<typeof findGameById>>;
    players: Awaited<ReturnType<typeof getPlayersWithUniqueFeedbackForGame>>;
};

export const loader: LoaderFunction = async ({params: {gameId}}) => {
    invariant(gameId, "Expected params.gameId");
    const [game, players] = await Promise.all([findGameById(gameId), getPlayersWithUniqueFeedbackForGame(gameId)])
    return json<LoaderData>({game, players});
};


export const action: ActionFunction = async ({params: {gameId}, request}) => {
    invariant(gameId, "Expected params.gameId");
    const formData = await request.formData();
    const intent = formData.get("intent")

    if (intent === 'zusage') {
        const playerIds = formData.getAll("receiver") as string[]
        await mailhelper.sendGameZusage({gameId, playerIds})
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
                                    className="pl-1 font-default-semibold text-sm md:text-xl">{`${player.name}`}</span>
                                <span
                                    className="font-default-medium text-gray-500 text-sm md:text-xl pl-2 hidden md:inline">{`(${player.email})`}</span>
                            </label>
                        </div>
                    )
                })
            }
        </div>
    )
}

const GameZusage = () => {
    const {game, players} = useLoaderData<LoaderData>();
    const gameTime = dateUtils.format(new Date(game.gameTime));
    const transition = useTransition();
    const formRef = useRef<HTMLFormElement>(null);

    return (
        <div className="mb-6 grid gap-6 bg-gray-300 px-4 md:grid-cols-2">
            <div className="pt-1 font-default-semibold md:col-span-2">
                <p>
                    <span
                        className="text-gray-500 text-sm md:text-xl">{messages.adminGameZusageForm.titleGame}
                    </span>
                    <span className="pl-2 font-default-bold ">{gameTime}</span>
                </p>
                <p>
                    <span
                        className="text-gray-500 text-sm md:text-xl">{messages.adminGameZusageForm.titleGameTime}
                    </span>
                    <span
                        className="pl-2 font-default-bold">{messages.adminGameZusageForm.spielort(game.spielort)}
                    </span>
                </p>
            </div>
            <Form ref={formRef} method="post">
                <fieldset disabled={transition.state === "submitting"}>
                    <div className="col-span-2">
                        <label
                            htmlFor="player"
                            className="mb-2 block font-default-bold text-gray-900"
                        >
                            {messages.adminGameZusageForm.mailReceiver}
                        </label>
                        <PlayerList players={players}/>
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
                        value="zusage"
                        disabled={transition.state === 'submitting'}
                    >
                        {messages.adminGameZusageForm.sendZusageBtn}
                    </button>
                </div>
            </Form>
        </div>
    )


}

export default GameZusage