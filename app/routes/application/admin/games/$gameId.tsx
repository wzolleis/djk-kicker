import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import ErrorView from "~/components/errorhandling/ErrorView";
import { Form, useCatch, useLoaderData, useTransition } from "@remix-run/react";
import CatchView from "~/components/errorhandling/CatchView";
import messages from "~/components/i18n/messages";
import { findGameById, updateGame } from "~/models/admin.games.server";
import { requireUserId } from "~/session.server";
import type { Game } from "@prisma/client";
import { dateTimeLocalInputValueToDateTime, dateTimeToDateTimeLocalInputFormValue } from "~/utils";
import { DateTime } from "luxon";

type LoaderData = {
  game: Awaited<ReturnType<typeof findGameById>>;
};

export const loader: LoaderFunction = async ({ params: { gameId } }) => {
  invariant(gameId, "Expected params.gameId");
  return json<LoaderData>({
    game: await findGameById(gameId)
  });
};

export const action: ActionFunction = async ({
                                               params: { gameId },
                                               request
                                             }) => {
  const formData = await request.formData();
  const name = formData.get("name");
  const gameTime = formData.get("gameTime");
  const userId = await requireUserId(request);

  invariant(typeof gameId === "string", "GameId must be a string");
  invariant(typeof userId === "string", "UserId must be a string");
  invariant(typeof name === "string", "name must be a string");
  invariant(typeof gameTime === "string", "gameTime must be a string");
  invariant(!!userId, "UserId muss gesetzt sein");
  invariant(!!gameId, "GameId muss gesetzt sein");

  const toUpdate: Game = {
    id: gameId,
    name,
    gameTime: dateTimeLocalInputValueToDateTime(gameTime).toJSDate(),
    link: null, // todo
    spielort: null // todo
  };

  await updateGame(toUpdate);
  return redirect("application/admin/games");
};

const EditGame = () => {
  const { game } = useLoaderData<LoaderData>();
  const transition = useTransition();

  return (
    <div className="mb-6 grid gap-6 bg-gray-300 px-4 md:grid-cols-2">
      <div className="pt-2 font-poppins-semibold text-4xl md:col-span-2">{`Spiel ${game.name}`}</div>
      <Form method="post" className="py-2">
        <fieldset disabled={transition.state === "submitting"}>
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-gray-900"
            >
              {messages.adminGamesForm.name}
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              placeholder={messages.adminEditGameForm.name}
              className="block w-full rounded-lg border border-2 border-gray-600 p-2.5 text-sm placeholder-gray-400 focus:border-blue-500"
              defaultValue={game.name}
            />
          </div>
          <div>
            <label
              htmlFor="eventTime"
              className="mb-2 block pt-2 text-sm font-medium text-gray-900"
            >
              {messages.adminEditGameForm.gameTime}
            </label>
            <input
              type="datetime-local"
              id="gameTime"
              name="gameTime"
              required
              autoFocus
              placeholder={messages.adminEditGameForm.gameTime}
              className="block w-full rounded-lg border border-2 border-gray-600 p-2.5 text-sm placeholder-gray-400 focus:border-blue-500"
              defaultValue={dateTimeToDateTimeLocalInputFormValue(
                DateTime.fromISO(game.gameTime)
              )}
            />
          </div>
          <div className="text-right">
            <button
              type="submit"
              className="bg-y my-2 rounded bg-blue-500 py-2 px-2 text-white hover:bg-blue-600 focus:border-2 disabled:bg-blue-300"
            >
              {transition.state === "submitting"
                ? messages.adminEditGameForm.submitting
                : messages.adminEditGameForm.submit}
            </button>
          </div>
        </fieldset>
      </Form>
    </div>
  );
};

export const ErrorBoundary = ({ error }: { error: Error }) => {
  return <ErrorView error={error} />;
};

export const CatchBoundary = () => {
  const caught = useCatch();
  const { statusText, status } = caught;
  return (
    <CatchView
      statusText={statusText}
      status={status}
      caught={caught}
      description={"Spiel kann nicht geladen werden"}
    />
  );
};

export default EditGame;