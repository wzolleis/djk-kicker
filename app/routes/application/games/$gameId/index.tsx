import type { LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import { getGameById } from "~/models/games.server";
import { useLoaderData } from "@remix-run/react";
import Players from "~/components/game/Players";
import PageHeader from "~/components/common/PageHeader";
import { useDate } from "~/utils";
import SmallTag from "~/components/common/tags/SmallTag";
import type { GameWithFeedback } from "~/routes/application/games/$gameId";
import type { PlayerWithFeedback } from "~/models/player.server";
import { getPlayersWithUniqueFeedbackForGame } from "~/models/player.server";
import { authenticatePlayer } from "~/utils/session.server";
import { NoTokenWarning } from "~/components/warnings/NoTokenWarning";
import ContentContainer from "~/components/common/container/ContentContainer";
import ConfirmedPlayersCounter from "~/components/game/feedback/ConfirmedPlayersCounter";
import DeclinedPlayersCounter from "~/components/game/feedback/DeclinedPlayersCounter";
import UnknownPlayersCounter from "~/components/game/feedback/UnknownPlayersCounter";
import UndecidedPlayersCounter from "~/components/game/feedback/UndecidedPlayersCounter";
import { Player } from "@prisma/client";

type LoaderData = {
  game: GameWithFeedback;
  players: PlayerWithFeedback[];
  isAuthenticated: boolean;
  player: Player;
};

export const loader: LoaderFunction = async ({ params, request }) => {
  invariant(params.gameId, "Help");
  const gameId = params.gameId;
  const game: GameWithFeedback | null = await getGameById(gameId);
  const players: PlayerWithFeedback[] = await getPlayersWithUniqueFeedbackForGame(gameId);
  const { isAuthenticated, cookieHeader, player, isFirstAuthentication } = await authenticatePlayer(params, request);

  if (player && isFirstAuthentication) {
    return redirect("/application/dashboard", {
      headers: {
        "Set-Cookie": cookieHeader,
      },
    });
  }

  return json(
    { game, players, isAuthenticated, player },
    {
      headers: {
        "Set-Cookie": cookieHeader,
      },
    }
  );
};

const GameIndex = () => {
  const { game, players, isAuthenticated, player } = useLoaderData() as unknown as LoaderData;
  // @ts-ignore
  return (
    <>
      <section className={"mt-5 flex flex-col gap-5"}>
        <ContentContainer>
          <header className={"space-y-2"}>
            <div className={"flex justify-between"}>
              <PageHeader title={game.name} />
            </div>
            <div className={"flex gap-2"}>
              <SmallTag text={useDate(game.gameTime)} />
            </div>
          </header>
        </ContentContainer>
        <div className={" grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4"}>
          <ContentContainer>
            <ConfirmedPlayersCounter game={game} />
          </ContentContainer>
          <ContentContainer>
            <DeclinedPlayersCounter game={game} />
          </ContentContainer>
          <ContentContainer>
            <UndecidedPlayersCounter game={game} />
          </ContentContainer>
          <ContentContainer>
            <UnknownPlayersCounter game={game} />
          </ContentContainer>
        </div>

        <NoTokenWarning hidden={isAuthenticated} />
        <Players isAuthenticated={isAuthenticated} players={players} gameId={game.id}></Players>
      </section>
    </>
  );
};

export default GameIndex;
