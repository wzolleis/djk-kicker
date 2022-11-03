import type { Game } from "@prisma/client";


interface gameHeaderProps {
  game: Game;
}


const gameHeader = ({ game }: gameHeaderProps) => {
  return (
    <div className={"rounded-lg shadow shadow-xl shadow-gray-900/5 bg-white p-3 py-5"}>
      <p className={"font-poppins-semibold text-darkblue text-3xl"}>{game.name}</p>
    </div>
  );
};
export default gameHeader;