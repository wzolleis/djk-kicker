import { Feedback, Game } from "@prisma/client";
import GameCard from "~/components/game/GameCard";
import messages from "~/components/i18n/messages";

type NextGameProps = {
  game: Game;
};

export const NextGame = ({ game }: NextGameProps) => {
  return (
    <>
      <div className={"flex flex-col gap-3"}>
        <p className={"font-default-medium text-gray-600"}>{messages.game.headings.gameData}</p>
        <GameCard game={game}></GameCard>
      </div>
    </>
  );
};
