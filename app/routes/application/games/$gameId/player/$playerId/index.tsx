import type {Prisma} from "@prisma/client";
import type {ActionFunction, LoaderFunction} from "@remix-run/node";
import {json, redirect} from "@remix-run/node";
import {useLoaderData} from "@remix-run/react";
import invariant from "tiny-invariant";
import {errors} from "~/components/i18n/errors";
import EditPlayerStatusForm from "~/components/player/EditPlayerStatusForm";
import {NoTokenWarning} from "~/components/warnings/NoTokenWarning";
import routeLinks from "~/config/routeLinks";
import {getPlayerFeedbackForGame, updateFeedback,} from "~/models/feedback.server";
import {getFeedbackValues} from "~/utils/form.session";
import {authenticatePlayer} from "~/utils/session.server";

export type PlayerFeedbackForGame = Prisma.PlayerGetPayload<{
    include: {
        feedback: {
            where: {
                gameId: string;
            };
        };
    };
}>;
type LoaderData = {
    player: PlayerFeedbackForGame;
    isAuthenticated: boolean;
};

export const loader: LoaderFunction = async ({ params, request }) => {
    const gameId = params.gameId;
    const playerIdParam = params.playerId;
    invariant(gameId, "Help");
    invariant(playerIdParam, "Help");

    const playerWithFeedback: PlayerFeedbackForGame | null =
        await getPlayerFeedbackForGame(playerIdParam, gameId);
    const { playerId } = await authenticatePlayer(request);
    const isAuthenticated = playerIdParam === playerId;
    return json({ player: playerWithFeedback, isAuthenticated });
};

export const action: ActionFunction = async ({ params, request }) => {
    console.group("updateFeedback action")
    try {
        const playerIdParam = params.playerId;
        const gameId = params.gameId!;
        const {playerId} = await authenticatePlayer(request);
        const isAuthenticated = playerId === playerIdParam;
        if (!isAuthenticated) {
            console.error('player not authenticated', playerId, playerIdParam)
            throw json("no permission", 403);
        }
        const formData = await request.formData();
        const {status, note, playerCount} = getFeedbackValues(formData);

        if (!gameId) {
            throw new Error(errors.game.updateFeedback.noGameId);
        }

        console.info("update feedback for player", playerId)
        const newFeedback = await updateFeedback(
            playerId!,
            gameId,
            status,
            playerCount,
            note ?? null
        );

        if (formData.get("origin") === "dashboard") {
            return json({newFeedback});
        }
        return redirect(routeLinks.game(gameId));
    } finally {
        console.groupEnd()
    }
};

const EditPlayerFeedback = () => {
    const { player, isAuthenticated } = useLoaderData() as LoaderData;

    // @ts-ignore
    return (
        <>
            <NoTokenWarning hidden={isAuthenticated} />
            <EditPlayerStatusForm
                player={player}
                isAuthenticated={isAuthenticated}
            />
        </>
    );
};

export default EditPlayerFeedback;
