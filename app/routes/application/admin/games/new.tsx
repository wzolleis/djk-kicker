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
  const gameTime = formData.get("gameTime");
  const userId = await requireUserId(request);

  invariant(typeof userId === "string", "UserId must be a string");
  invariant(typeof name === "string", "name must be a string");
  invariant(typeof gameTime === "string", "gameTime must be a string");
  invariant(!!userId, "UserId muss gesetzt sein");

  await createGame(
    {
      gameTime: dateTimeLocalInputValueToDateTime(gameTime).toJSDate(),
      name
    });
  return redirect("application/admin/games");
};

const defaultGameTime = ({ hour, minute }: { hour: number, minute: number } = { hour: 20, minute: 0 }): string => {
  return dateTimeToDateTimeLocalInputFormValue(DateTime.now().set({
    hour,
    minute,
    millisecond: 0
  }));
};

const NewGame = () => {
  const transition = useTransition();

  return (
    <div className="grid gap-6 mb-6 bg-gray-300 md:grid-cols-2 px-4">
      <div className="text-4xl font-poppins-semibold md:col-span-2 pt-2">{messages.adminCreateGameForm.newGame}</div>
      <Form method="post" className="py-2">
        <fieldset
          disabled={transition.state === "submitting"}
        >
          <div>
            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">
              {messages.adminGamesForm.name}
            </label>
            <input type="text"
                   id="name"
                   name="name"
                   required
                   placeholder={messages.adminCreateGameForm.name}
                   className="border text-sm rounded-lg block w-full p-2.5 border-gray-600 placeholder-gray-400 focus:border-blue-500 border-2"
                   defaultValue={"Fussball"}
            />
          </div>
          <div>
            <label htmlFor="eventTime" className="block mb-2 text-sm font-medium text-gray-900 pt-2">
              {messages.adminCreateGameForm.gameTime}
            </label>
            <input type="datetime-local"
                   id="gameTime"
                   name="gameTime"
                   required
                   autoFocus
                   placeholder={messages.adminCreateGameForm.gameTime}
                   className="border text-sm rounded-lg block w-full p-2.5 border-gray-600 placeholder-gray-400 focus:border-blue-500 border-2"
                   defaultValue={defaultGameTime({ hour: 20, minute: 0 })}
            />
          </div>
          <div className="text-right">
            <button
              type="submit"
              className="rounded bg-blue-500 py-2 text-white hover:bg-blue-600 disabled:bg-blue-300 focus:border-2 my-2 px-2 bg-y"
            >
              {transition.state === "submitting" ? messages.adminCreateGameForm.submitting : messages.adminCreateGameForm.submit}
            </button>
          </div>
        </fieldset>
      </Form>
    </div>
  );
};
export default NewGame;