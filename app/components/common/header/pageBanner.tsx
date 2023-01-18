import {GameWithFeedback} from "~/config/applicationTypes";
import {isGameStatus} from "~/config/admin.game.constants";
import {useDate} from "~/utils";
import React from "react";
import messages from "~/components/i18n/messages";

export const AlertBanner = ({text}: { text: string }) => {
    return (
        <div role="alert">
            <div className="bg-red-500 text-white font-bold px-4 py-2">
                Achtung
            </div>
            <div className="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700">
                <p>{text}</p>
            </div>
        </div>
    )
}

export const InfoBanner = ({text}: { text: string }) => {
    return (
        <div role="info">
            <div className="bg-blue-600 text-white font-bold px-4 py-2">
                Information
            </div>
            <div className="border border-t-0 border-yellow-400 rounded-b bg-yellow-100 px-4 py-3 black">
                <p>{text}</p>
            </div>
        </div>
    )
}

export const GameBanner = ({game}: {game: GameWithFeedback | null} ) => {
    const gameStatus = game?.status
    if (!gameStatus) return null
    if (!isGameStatus(gameStatus)) return null
    const gameDate = useDate(new Date(game.gameTime))

    return (
        <>
            {gameStatus === "Zusage" && <InfoBanner text={messages.gameStatus.zusage(gameDate)}/>}
            {gameStatus === "Absage" && <AlertBanner text={messages.gameStatus.absage(gameDate)}/>}
        </>
    )
}
