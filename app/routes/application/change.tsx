import {ActionFunction, json, LoaderFunction, redirect,} from "@remix-run/node";
import {getCommonSearchParameters} from "~/utils/parameters.server";
import {decryptPlayerToken} from "~/utils/token.server";
import {changePlayer, getPlayerFromDatabaseSession} from "~/utils/session.server";
import {getPlayerById} from "~/models/player.server";
import {Player} from "@prisma/client";
import {useLoaderData} from "@remix-run/react";
import {useEffect, useState} from "react";
import Modal from "~/components/common/modal/Modal";
import ConfirmPlayerChange from "~/components/game/players/ConfirmPlayerChange";
import routeLinks from "~/helpers/constants/routeLinks";

type LoaderData = {
    player: Player;
    newPlayer: Player;
};

export const loader: LoaderFunction = async ({request, params}) => {
    const {gameToken} = getCommonSearchParameters(request);
    if (!gameToken) {
        throw redirect("/");
    }
    const decryptedToken = decryptPlayerToken(gameToken);
    const player = await getPlayerFromDatabaseSession(request);
    const newPlayer = await getPlayerById(decryptedToken.playerId);

    if (!player || !newPlayer) {
        throw redirect("/");
    }
    return json<LoaderData>({
        player,
        newPlayer,
    });
};

export const action: ActionFunction = async ({request, params}) => {
    const body = await request.formData();
    const intent = await body.get("intent")
    const {gameToken} = getCommonSearchParameters(request);
    if (!gameToken) {
        throw redirect("/");
    }
    const decryptedToken = decryptPlayerToken(gameToken);


    if (intent === "confirm") {
        return await changePlayer(request, decryptedToken)
    }

    if (intent === "decline") {
        return redirect(routeLinks.game(decryptedToken.gameId))
    }

    return json({intent})
};

const Change = () => {
    const {player, newPlayer} = useLoaderData<LoaderData>();

    const [showModal, setShowModal] = useState(true);
    useEffect(() => {
    });

    return (
        <>
            <Modal
                title={"Spieler ändern"}
                show={showModal}
                onClose={() => false}>
                <ConfirmPlayerChange player={player} newPlayer={newPlayer}/>
            </Modal>
        </>
    );
};

export default Change;
