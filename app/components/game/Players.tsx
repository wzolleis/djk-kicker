import PlayerCard from "~/components/game/players/PlayerCard";
import MainPageContent from "~/components/common/MainPageContent";
import SmallButton from "~/components/common/buttons/SmallButton";
import type { PlayerWithFeedback } from "~/models/player.server";
import { an } from "vitest/dist/global-58e8e951";

interface PlayerProps {
  players: PlayerWithFeedback[];
  gameId: string;
  isAuthenticated: boolean;
  onClick?: any;
}

const Players = ({ players, gameId, isAuthenticated, onClick }: PlayerProps) => {
  return (
    <>
      <MainPageContent>
        <header className={"flex items-center justify-between"}>
          <p className={"font-default-medium text-headline-small text-darkblue"}>Spieler</p>
          {isAuthenticated && <SmallButton title={"Spieler hinzufügen"} link={`/application/player/create?gameid=${gameId}`} />}
        </header>
        <main className={"mt-5 flex flex-col gap-3 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"}>
          {players.map((player: PlayerWithFeedback) => (
            <PlayerCard onClick={onClick} key={player.id} player={player}></PlayerCard>
          ))}
        </main>
      </MainPageContent>
    </>
  );
};
export default Players;
