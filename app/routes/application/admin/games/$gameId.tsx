import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import ErrorView from "~/components/errorhandling/ErrorView";
import { Form, useCatch, useLoaderData, useTransition } from "@remix-run/react";
import CatchView from "~/components/errorhandling/CatchView";
import messages from "~/components/i18n/messages";
import { deleteGame, findGameById, updateGame } from "~/models/admin.games.server";
import { requireUserId } from "~/session.server";
import type { Game } from "@prisma/client";
import { dateTimeLocalInputValueToDateTime, dateTimeToDateTimeLocalInputFormValue } from "~/utils";
import { DateTime } from "luxon";
import toast from "react-hot-toast";

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
  const intent = formData.get("intent");

  invariant(typeof userId === "string", "UserId must be a string");
  invariant(typeof name === "string", "name must be a string");
  invariant(typeof gameTime === "string", "gameTime must be a string");
  invariant(!!userId, "UserId muss gesetzt sein");
  invariant(typeof gameId === "string", "GameId must be a string");
  invariant(!!gameId, "GameId muss gesetzt sein");

  if (intent === "delete") {
    await deleteGame(gameId);
    return redirect("application/admin/games");
  }

  // update
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

const notify = (message: string) => {
  toast(message);
};

const EditGame = () => {
  const { game } = useLoaderData<LoaderData>();
  const transition = useTransition();
  const isUpdating = transition.submission?.formData.get("intent") === "update";
  const isDeleting = transition.submission?.formData.get("intent") === "delete";

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
          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-y my-2 rounded bg-red-500 py-2 px-2 text-white hover:bg-blue-600 focus:border-2 disabled:bg-red-300"
              name="intent"
              value="delete"
              disabled={isDeleting}
              onClick={() => {
                notify("Das Spiel wurde gelöscht");
              }}
            >
              {transition.state === "submitting" ? messages.adminEditGameForm.deleting : messages.adminEditGameForm.delete}
            </button>
            <button
              type="submit"
              className="bg-y my-2 rounded bg-blue-500 py-2 px-2 text-white hover:bg-blue-600 focus:border-2 disabled:bg-blue-300"
              name="intent"
              value="update"
              disabled={isUpdating}
              onClick={() => {
                notify("Das Spiel wurde gespeichert");
              }}
            >
              {transition.state === "submitting"
                ? messages.adminEditGameForm.updating
                : messages.adminEditGameForm.update}
            </button>
          </div>
        </fieldset>
      </Form>
    </div>
  );
};

export const ErrorBoundary = ({ error }: { error: Error }) => {
    return <ErrorView error={error} />;
  }
;

export const CatchBoundary = () => {
    const caught = useCatch();
    const { statusText, status } = caught;
    return (
      <CatchView
        statusText={statusText}
        status={status}
        caught={caught}
        description={"Fehler bei der Verwaltung des Spiels"}
      />
    );
  }
;

export default EditGame;