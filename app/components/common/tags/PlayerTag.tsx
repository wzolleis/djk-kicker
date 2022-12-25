import {Player} from "@prisma/client";


const PlayerTag = ({player, onClick}: { player: Player, onClick: () => void }) => {
    return (
        <div
            className={"bg-gray-200 px-3 py-1 rounded-full flex gap-0 transition duration-150 ease-in-out text-black hover:scale-90 hover:bg-gray-100"}>
            <p className={"font-default-medium"}>{player.name}</p>
            <img className={"h-6 hover:cursor-pointer hover:scale-125"} src="/img/icons/close.png"
                 onClick={() => onClick()} alt=""/>
        </div>
    )
}

export default PlayerTag;