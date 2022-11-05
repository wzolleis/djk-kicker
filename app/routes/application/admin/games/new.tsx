import { Form, useTransition } from "@remix-run/react";
import { createGame } from "~/models/admin.games.server";
import messages from "~/components/i18n/messages";
import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { requireUserId } from "~/session.server";
import invariant from "tiny-invariant";
import { dateTimeLocalInputValueToDateTime, dateTimeToDateTimeLocalInputFormValue } from "~/utils";
import { DateTime } from "luxon";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const name = formData.get("name");
  const spielort = formData.get("spielort");
  const gameTime = formData.get("gameTime");
  const userId = await requireUserId(request);
  const validSpielort = typeof spielort === "string" && !Number.isNaN(parseInt(spielort, 10));

  invariant(typeof userId === "string", "UserId must be a string");
  invariant(typeof name === "string", "name must be a string");
  invariant(typeof gameTime === "string", "gameTime must be a string");
  invariant(!!userId, "UserId muss gesetzt sein");
  invariant(validSpielort, "Der Wert von Spielort muss eine Zahl sein");
  await createGame({
    gameTime: dateTimeLocalInputValueToDateTime(gameTime).toJSDate(),
    name,
    spielort
  });
  return redirect("application/admin/games");
};

const defaultGameTime = (
  { hour, minute }: { hour: number; minute: number } = { hour: 20, minute: 0 }
): string => {
  return dateTimeToDateTimeLocalInputFormValue(
    DateTime.now().set({
      hour,
      minute,
      millisecond: 0
    })
  );
};

const NewGame = () => {
  const transition = useTransition();

  return (
    <div className="mb-6 grid gap-6 bg-gray-300 px-4 md:grid-cols-2">
      <div className="pt-2 font-poppins-semibold text-4xl md:col-span-2">
        {messages.adminCreateGameForm.newGame}
      </div>
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
              placeholder={messages.adminCreateGameForm.name}
              className="block w-full rounded-lg border border-2 border-gray-600 p-2.5 text-sm placeholder-gray-400 focus:border-blue-500"
              defaultValue={"Fussball"}
            />
          </div>
          <div>
            <label
              htmlFor="eventTime"
              className="mb-2 block pt-2 text-sm font-medium text-gray-900"
            >
              {messages.adminCreateGameForm.gameTime}
            </label>
            <input
              type="datetime-local"
              id="gameTime"
              name="gameTime"
              required
              autoFocus
              placeholder={messages.adminCreateGameForm.gameTime}
              className="block w-full rounded-lg border border-2 border-gray-600 p-2.5 text-sm placeholder-gray-400 focus:border-blue-500"
              defaultValue={defaultGameTime({ hour: 20, minute: 0 })}
            />
          </div>
          <div className={"flex flex-col font-inter-regular text-gray-500"}>
            <label htmlFor="spielort">Status</label>
            <select
              name="spielort"
              id="spielort"
              className="rounded rounded border border-gray-300 outline-none"
              defaultValue={"0"}
            >
              <option value={"0"}>Halle</option>
              <option value={"1"}>Draussen</option>
            </select>
          </div>

          <div className="text-right">
            <button
              type="submit"
              className="bg-y my-2 rounded bg-blue-500 py-2 px-2 text-white hover:bg-blue-600 focus:border-2 disabled:bg-blue-300"
            >
              {transition.state === "submitting"
                ? messages.adminCreateGameForm.submitting
                : messages.adminCreateGameForm.submit}
            </button>
          </div>
        </fieldset>
      </Form>
    </div>
  );
};
export default NewGame;