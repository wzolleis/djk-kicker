import type {LoaderFunction} from "@remix-run/node";
import {json, redirect} from "@remix-run/node";
import invariant from "tiny-invariant";
import {useLoaderData} from "@remix-run/react";
import Players from "~/components/game/Players";
import type {PlayerWithFeedback} from "~/models/player.server";
import {getPlayersWithUniqueFeedbackForGame} from "~/models/player.server";
import {authenticatePlayer} from "~/utils/session.server";
import {Player} from "@prisma/client";
import routeLinks from "~/config/routeLinks";
import GameSummary from "~/components/game/GameSummary";
import Subheading from "~/components/common/header/Subheading";
import messages from "~/components/i18n/messages";
import TransitionContainer from "~/components/common/container/transitionContainer";
import {useNextGame} from "~/utils/gameUtils";
import ContentContainer from "~/components/common/container/ContentContainer";

type LoaderData = {
    players: PlayerWithFeedback[];
    isAuthenticated: boolean;
    player: Player;
};

export const loader: LoaderFunction = async ({params, request}) => {
    invariant(params.gameId, "expected gameId in url parameters");
    const gameId = params.gameId;
    const players: PlayerWithFeedback[] =
        await getPlayersWithUniqueFeedbackForGame(gameId);
    const {isAuthenticated, cookieHeader, player, isFirstAuthentication} = await authenticatePlayer(request);

    if (player && isFirstAuthentication) {
        return redirect(routeLinks.dashboard, {
            headers: {
                "Set-Cookie": cookieHeader,
            },
        });
    }

    return json(
        {players, isAuthenticated, player},
        {
            headers: {
                "Set-Cookie": cookieHeader,
            },
        }
    );
};

const GameIndex = () => {
    const gameWithFeedBack = useNextGame()
    const {players, isAuthenticated} =
        useLoaderData() as unknown as LoaderData;

    // @ts-ignore
    return (
        <TransitionContainer>
            <ContentContainer className={"mt-2.5 shadow-lg shadow-blue-400/50"}>
            <section className={"mt-5 flex flex-col gap-5"} key={"game"}>
                <Subheading title={`${messages.game.headings.nextGame}`}/>
                <GameSummary game={gameWithFeedBack}/>
                <Players
                    isAuthenticated={isAuthenticated}
                    players={players}
                    gameId={gameWithFeedBack.id}
                />
            </section>
            </ContentContainer>
        </TransitionContainer>
    );
};

export default GameIndex;
