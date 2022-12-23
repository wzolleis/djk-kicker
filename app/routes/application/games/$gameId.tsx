import type {LoaderFunction} from "@remix-run/node";
import {json, redirect} from "@remix-run/node";
import invariant from "tiny-invariant";
import {getGameById} from "~/models/games.server";
import {Outlet, useLoaderData, useNavigate} from "@remix-run/react";
import Players from "~/components/game/Players";
import PageHeader from "~/components/common/PageHeader";
import {useDate} from "~/utils";
import SmallTag from "~/components/common/tags/SmallTag";
import type {PlayerWithFeedback} from "~/models/player.server";
import {getPlayersWithUniqueFeedbackForGame} from "~/models/player.server";
import {authenticatePlayer} from "~/utils/session.server";
import ContentContainer from "~/components/common/container/ContentContainer";
import ConfirmedPlayersCounter from "~/components/game/feedback/ConfirmedPlayersCounter";
import DeclinedPlayersCounter from "~/components/game/feedback/DeclinedPlayersCounter";
import UnknownPlayersCounter from "~/components/game/feedback/UnknownPlayersCounter";
import UndecidedPlayersCounter from "~/components/game/feedback/UndecidedPlayersCounter";
import {Feedback, Game, Player, Prisma} from "@prisma/client";
import Modal from "~/components/common/modal/Modal";
import {useEffect, useState} from "react";
import AdditionalPlayersCounter from "~/components/game/feedback/ConfirmedAdditionalsCounter";

export type FeedBackWithPlayer = Feedback & {
  player: Player;
};

export interface GameWithFeedback extends Game {
  feedback: FeedBackWithPlayer[];
}

export type GameWithFeedback2 = Prisma.GameGetPayload<{
  include: {
    feedback: {
      include: {
        player: true;
      };
    };
  };
}>;

type LoaderData = {
  game: GameWithFeedback;
  players: PlayerWithFeedback[];
  isAuthenticated: boolean;
  player: Player;
  playerId: string;
};

export const loader: LoaderFunction = async ({ params, request }) => {
  invariant(params.gameId, "Help");
  const gameId = params.gameId;
  const playerId = params.playerId;
  const game: GameWithFeedback | null = await getGameById(gameId);
  const players: PlayerWithFeedback[] = await getPlayersWithUniqueFeedbackForGame(gameId);
  const { cookieHeader, player, isFirstAuthentication } = await authenticatePlayer(params, request);
  const isAuthenticated = player?.id === playerId;


  if (player && isFirstAuthentication) {
    return redirect("/application/dashboard", {
      headers: {
        "Set-Cookie": cookieHeader,
      },
    });
  }

  return json(
    { game, players, isAuthenticated, player, playerId },
    {
      headers: {
        "Set-Cookie": cookieHeader,
      },
    }
  );
};


const GameIndex = () => {
  const { game, players, isAuthenticated } = useLoaderData() as unknown as LoaderData;
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setShowModal(false);
  }, [game.id]);

  function closeModal() {
    setShowModal(false);
    navigate(`/application/games/${game.id}`);
  }

  function openModal() {
    setShowModal(true);
  }

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
        <div className={" grid grid-cols-3 gap-4 md:grid-cols-4 lg:grid-cols-5"}>
          <ContentContainer>
            <ConfirmedPlayersCounter game={game} />
          </ContentContainer>
          <ContentContainer>
            <AdditionalPlayersCounter game={game} />
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
        <Players onClick={() => openModal()} isAuthenticated={isAuthenticated} players={players} gameId={game.id}></Players>
      </section>
      <Modal onClose={() => closeModal()} title={"Status bearbeiten"} show={showModal}>
        <Outlet></Outlet>
        <div className={"mt-5 flex w-full justify-center"}>
          <button onClick={() => closeModal()} hidden={isAuthenticated} className={"w-full rounded-xl bg-indigo-600 p-3 font-inter-medium text-white "}>
            Zurück
          </button>
        </div>
      </Modal>
    </>
  );
};

export default GameIndex;
