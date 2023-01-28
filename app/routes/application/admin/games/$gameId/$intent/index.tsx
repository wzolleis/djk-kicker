import {useLoaderData,} from "@remix-run/react";
import {findGameById} from "~/models/admin.games.server";
import {json, LoaderFunction,} from "@remix-run/node";
import invariant from "tiny-invariant";
import messages from "~/components/i18n/messages";
import {getFeedbackForGame} from "~/models/feedback.server";
import {Feedback, Player} from "@prisma/client";
import {parseStatus} from "~/utils/statusUtils";
import {usePlayers} from "~/utils";
import {ButtonIntent, isButtonIntent} from "~/config/action";

type LoaderData = {
    game: Awaited<ReturnType<typeof findGameById>>;
    feedback: Feedback[]
    intent: ButtonIntent
};

export const loader: LoaderFunction = async ({
                                                 request,
                                                 params: {gameId, intent},
                                             }) => {
    invariant(gameId, "Expected params.gameId");
    invariant(intent, "Expected params.intent");
    invariant(isButtonIntent(intent), "invalid intent value: " + intent)
    const feedback = await getFeedbackForGame(gameId)
    const game= await findGameById(gameId)
    return json<LoaderData>({game, intent, feedback});
}

type PlayerCardProps = {
    player: Player
    feedback: Feedback[]
    intent: ButtonIntent
}
const PlayerCard = ({player, intent, feedback}: PlayerCardProps) => {
    const playerFeedback = feedback.find((feedback) => feedback.playerId === player.id)
    return (
        <div className="bg-blue-200 rounded-lg" key={player.id}>
            <div className="h-50 rounded-lg">
                <div className="flex items-center justify-start border-b">
                    <span
                        className="p-3 text-gray-700 text-lg font-bold">{`${player.name}`}
                    </span>
                    <span
                        className="p-3 text-gray-700 text-lg font-bold hidden md:inline">{`${player.email}`}
                    </span>
                </div>
                <div className={"p-3 text-lg"}>
                    {`Rückmeldung: ${parseStatus(playerFeedback?.status ?? 0)}`}
                </div>
                <div className="flex items-center justify-between border-b" data-testid={"game-card-testid"}>
                    <div
                        className="p-3 text-gray-700 text-lg font-bold">{`TODO Status (Einladung verschickt, Absage verschickt, Zusage verschickt)`}
                    </div>
                </div>
                <div className="p-3 border-t text-lg">
                    <div className="flex">
                        <button
                            className="ml-auto p-3 text-slate-800 text-sm bg-white border border-slate-200 font-small md:font-medium px-4 py-2 inline-flex space-x-1 items-center rounded-lg hover:scale-110 hover:text-blue-600">
                            <i className={"fa fa-envelope"}/>
                            <span className={"px-1"}>{messages.buttons[intent]}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

const GamePlayerIntent = () => {
    const players = usePlayers()
    const {feedback, intent} = useLoaderData<LoaderData>();
    return (
        <div className={"w-full mt-3 space-y-3 "}>
            {
                players.map((player: Player) => {
                    return <PlayerCard player={player} feedback={feedback} key={player.id} intent={intent}/>
                })
            }
        </div>
    )
};

export default GamePlayerIntent;
