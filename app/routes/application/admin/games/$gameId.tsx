import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import invariant from "tiny-invariant";
import { findGameById } from "~/models/games.server";
import ErrorView from "~/components/errorhandling/ErrorView";
import { useCatch, useLoaderData } from "@remix-run/react";
import CatchView from "~/components/errorhandling/CatchView";

type LoaderData = {
  game: Awaited<ReturnType<typeof findGameById>>
}

export const loader: LoaderFunction = async ({ params: { gameId } }) => {
  invariant(gameId, "Expected params.gameId");
  return json<LoaderData>({
    game: await findGameById(gameId)
  });
};


const EditGame = () => {
  const { game } = useLoaderData<LoaderData>();
  console.log(game);

  return (
    <div>Edit game!!!</div>
  );
};


export const ErrorBoundary = ({ error }: { error: Error }) => {
  return <ErrorView error={error} />;
};

export const CatchBoundary = () => {
  const caught = useCatch();
  const { statusText, status } = caught;
  return (
    <CatchView statusText={statusText} status={status} caught={caught}
               description={"Spiel kann nicht geladen werden"} />
  );
};

export default EditGame;