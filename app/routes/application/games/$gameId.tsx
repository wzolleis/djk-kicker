import type {LoaderFunction} from "@remix-run/node";
import {json, redirect} from "@remix-run/node";
import invariant from "tiny-invariant";
import {getGameById} from "~/models/games.server";
import {Outlet, useLoaderData, useNavigate} from "@remix-run/react";
import Players from "~/components/game/Players";
import type {PlayerWithFeedback} from "~/models/player.server";
import {getPlayersWithUniqueFeedbackForGame} from "~/models/player.server";
import {authenticatePlayer} from "~/utils/session.server";
import {Player} from "@prisma/client";
import Modal from "~/components/common/modal/Modal";
import {useEffect, useState} from "react";
import routeLinks from "~/helpers/constants/routeLinks";
import GameSummary from "~/components/game/GameSummary";
import {GameWithFeedback} from "~/config/gameTypes";

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
    const game: GameWithFeedback | null = await getGameById(gameId);
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
    const [showModal, setShowModal] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        setShowModal(false);
    }, [game.id]);

    function closeModal() {
        setShowModal(false);
        navigate(routeLinks.game(game.id));
    }

    function openModal() {
        setShowModal(true);
    }

    // @ts-ignore
    return (
        <>
            <section className={"mt-5 flex flex-col gap-5"}>
                <GameSummary game={game}/>
                <Players
                    onClick={() => openModal()}
                    isAuthenticated={isAuthenticated}
                    players={players}
                    gameId={game.id}
                />
            </section>
            <Modal
                onClose={() => closeModal()}
                title={"Status bearbeiten"}
                show={showModal}>
                <Outlet></Outlet>
                <div className={"mt-5 flex w-full justify-center"}>
                    <button
                        onClick={() => closeModal()}
                        hidden={isAuthenticated}
                        className={
                            "w-full rounded-xl bg-indigo-600 p-3 font-inter-medium text-white "
                        }>
                        Zurück
                    </button>
                </div>
            </Modal>
        </>
    );
};

export default GameIndex;
