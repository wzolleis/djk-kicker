import {Player} from "@prisma/client";
import {useState} from "react";
import PlayerTag from "~/components/common/tags/PlayerTag";


type PlayerSelectorProps = {
    players: Player[];
}


function removePlayerFromArrayByPlayerId(playerArray: Array<Player>, playerId: string): Array<Player> {
    const playerIndex = playerArray.findIndex((player) => player.id === playerId)
    if (playerIndex > -1) {
        playerArray.splice(playerIndex, 1)
    }
    return playerArray;
}


const PlayerSelector = ({players}: PlayerSelectorProps) => {
    const [receivingPlayers, setReceivingPlayers] = useState(players)
    const [excludedPlayers, setExcludedPlayers] = useState(Array<Player>);

    const removePlayerFromReceiversList = (player: Player) => {
        setReceivingPlayers(removePlayerFromArrayByPlayerId(receivingPlayers, player.id))
        setExcludedPlayers([...excludedPlayers, player])
    }
    const addPlayerToReceiversList = (player: Player) => {
        setExcludedPlayers(removePlayerFromArrayByPlayerId(excludedPlayers, player.id))
        setReceivingPlayers([...receivingPlayers, player])
    }

    return (
        <section className={"flex flex-col gap-2"}>
            <div className={"w-full flex flex-col gap-2"}>
                <p className={"text-gray-600 font-default-medium border-b border-1 w-full"}>Einladung an:</p>
                <div className={"flex flex-wrap gap-3"}>
                    {receivingPlayers.map(receivingPlayer => (
                        <div  className={"flex "} key={receivingPlayer.id}>
                            <input type={"hidden"} name={"receiver"} value={receivingPlayer.id}/>
                            <PlayerTag onClick={() => removePlayerFromReceiversList(receivingPlayer)}
                                       player={receivingPlayer}/>
                        </div>
                    ))}
                </div>
            </div>

            <div className={"w-full flex flex-col gap-2"}>
                <p className={"text-gray-600 font-default-medium border-b border-1 w-full"}>Keine Einladung an:</p>
                <div className={"flex gap-3 flex-wrap"}>
                    {excludedPlayers.map(excludedPlayer => (
                        <div key={excludedPlayer.id}>
                            <PlayerTag onClick={() => addPlayerToReceiversList(excludedPlayer)}
                                       player={excludedPlayer}/>
                        </div>
                    ))}
                </div>
            </div>

                    </section>
    )

}

export default PlayerSelector;