import {ActionFunction, json, LoaderFunction, redirect} from "@remix-run/node";
import {getPlayersWithUniqueFeedbackForGame, PlayerWithFeedback} from "~/models/player.server";
import {useNextGame} from "~/utils/gameUtils";
import {useLoaderData} from "@remix-run/react";

type LoaderData = {
    players: PlayerWithFeedback[];
};

export const loader: LoaderFunction = async ({params}) => {

    const gameId = params.gameId
    if (!gameId) {
        return redirect("/application/admin/games")
    }

    const players: PlayerWithFeedback[] =
        await getPlayersWithUniqueFeedbackForGame(gameId);

    console.log('>>>>>> players', players)
    return json<LoaderData>({players})
}

export const action: ActionFunction = async ({params, request}) => {

    const formData = await request.formData();
    const gameId = params.gameId!

    console.log('>>>>>> gameId', gameId)


}

const GameFeedback = () => {
    const gameWithFeedBack = useNextGame();
    const data = useLoaderData<LoaderData>() as unknown as LoaderData;
    console.log('>> data', data)

    return (
        <div>Game Feedback ändern</div>
    )

}

export default GameFeedback