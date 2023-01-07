import type {LoaderFunction} from "@remix-run/node";
import {json, redirect} from "@remix-run/node";
import invariant from "tiny-invariant";
import {getGameById} from "~/models/games.server";
import {useLoaderData} from "@remix-run/react";
import Players from "~/components/game/Players";
import type {PlayerWithFeedback} from "~/models/player.server";
import {getPlayersWithUniqueFeedbackForGame} from "~/models/player.server";
import {authenticatePlayer} from "~/utils/session.server";
import {Player} from "@prisma/client";
import routeLinks from "~/helpers/constants/routeLinks";
import GameSummary from "~/components/game/GameSummary";
import {GameWithFeedback} from "~/config/gameTypes";
import Subheading from "~/components/common/header/Subheading";
import messages from "~/components/i18n/messages";
import TransitionContainer from "~/components/common/container/transitionContainer";

type LoaderData = {
    game: GameWithFeedback;
    players: PlayerWithFeedback[];
    isAuthenticated: boolean;
    player: Player;
    playerId: string;
};

export const loader: LoaderFunction = async ({params, request}) => {
    invariant(params.gameId, "Help");
    const gameId = params.gameId;
    const playerId = params.playerId;
    const game: GameWithFeedback | null = gameId ? await getGameById(gameId) : null
    const players: PlayerWithFeedback[] =
        await getPlayersWithUniqueFeedbackForGame(gameId);
    const {isAuthenticated, cookieHeader, player, isFirstAuthentication} =
        await authenticatePlayer(params, request);

    if (player && isFirstAuthentication) {
        return redirect(routeLinks.dashboard, {
            headers: {
                "Set-Cookie": cookieHeader,
            },
        });
    }

    return json(
        {game, players, isAuthenticated, player, playerId},
        {
            headers: {
                "Set-Cookie": cookieHeader,
            },
        }
    );
};

const GameIndex = () => {
    const {game, players, isAuthenticated} =
        useLoaderData() as unknown as LoaderData;

    // @ts-ignore
    return (
        <TransitionContainer>
            <section className={"mt-5 flex flex-col gap-5"} key={"game"}>
                <Subheading title={`${messages.game.headings.nextGame}`}/>
                <GameSummary game={game}/>
                <Players
                    isAuthenticated={isAuthenticated}
                    players={players}
                    gameId={game.id}
                />
            </section>
        </TransitionContainer>
    );
};

export default GameIndex;
