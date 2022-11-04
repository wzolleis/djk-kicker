import type { Game } from "@prisma/client";


interface gameHeaderProps {
  game: Game;
}


const gameHeader = ({ game }: gameHeaderProps) => {
  return (
    <div className={"flex px-2 flex-col w-full"}>
      <p className={"font-inter-light text-gray-500 text-item-heading uppercase m-0"}>Neues Spiel</p>
      <p className={"font-inter-semibold text-heading -mt-2"}>{game.name}</p>
    </div>
  );
};
export default gameHeader;