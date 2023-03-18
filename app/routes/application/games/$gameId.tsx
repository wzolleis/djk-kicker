import type {LoaderFunction} from "@remix-run/node";
import {json} from "@remix-run/node";
import {useLoaderData} from "@remix-run/react";
import invariant from "tiny-invariant";
import ContentContainer from "~/components/common/container/ContentContainer";
import TransitionContainer from "~/components/common/container/transitionContainer";
import GameSummary from "~/components/game/GameSummary";
import Players from "~/components/game/Players";
import type {PlayerWithFeedback} from "~/models/player.server";
import {getPlayersWithUniqueFeedbackForGame} from "~/models/player.server";
import {useNextGame} from "~/utils/gameUtils";
import {authenticatePlayer, commitSession} from "~/utils/session.server";

type LoaderData = {
    players: PlayerWithFeedback[];
    isAuthenticated: boolean;
};

export const loader: LoaderFunction = async ({params, request}) => {
    invariant(params.gameId, "expected gameId in url parameters");
    const gameId = params.gameId;
    const players: PlayerWithFeedback[] =
        await getPlayersWithUniqueFeedbackForGame(gameId);
    const {isAuthenticated, session} = await authenticatePlayer(request);

    return json<LoaderData>(
        {players, isAuthenticated},
        {
            headers: {
                "Set-Cookie": await commitSession(session),
            },
        }
    );
};

const GameIndex = () => {
    const gameWithFeedBack = useNextGame();
    const {players} = useLoaderData<LoaderData>() as unknown as LoaderData;

    return (
        <TransitionContainer>
            <ContentContainer
                className={"mt-2.5 bg-blue-200 shadow-lg shadow-blue-400/50"}>
                <section className={"mt-5 flex flex-col gap-5"} key={"game"}>
                    <GameSummary game={gameWithFeedBack}/>
                    <Players players={players}/>
                </section>
            </ContentContainer>
        </TransitionContainer>
    );
};

export default GameIndex;
