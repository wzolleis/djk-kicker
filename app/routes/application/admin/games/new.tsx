import { Form, useActionData, useTransition } from "@remix-run/react";
import GameView from "~/components/admin/games/GameView";
import type { GameActionData } from "~/models/games.server";
import { createGame } from "~/models/games.server";
import messages from "~/components/i18n/messages";
import dateUtils from "~/dateUtils";
import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { requireUserId } from "~/session.server";
import invariant from "tiny-invariant";
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

  await createGame({ gameTime: DateTime.fromISO(gameTime).toJSDate(), name });
  return redirect("application/admin/games");
};

const NewGame = () => {
  const errors = useActionData<GameActionData>();
  const transition = useTransition();
  const defaultValues: GameActionData = {
    gameTime: dateUtils.format(new Date(), { format: "dd.MM.yyyy" }),
    name: "Fussball"
  };

  return (
    <div className="grid gap-6 mb-6 bg-gray-300 md:grid-cols-2 px-4">
      <Form method="post" className="py-2">
        <fieldset
          disabled={transition.state === "submitting"}
        >
          {/* @ts-ignore */}
          <GameView errors={errors} defaultValues={defaultValues} />
          <div className="text-right">
            <button
              type="submit"
              className="rounded bg-blue-500 py-2 text-white hover:bg-blue-600 disabled:bg-blue-300 focus:border-2 my-2 px-2 bg-y"
            >
              {transition.state === "submitting" ? messages.gamesform.create.submitting : messages.gamesform.create.submit}
            </button>
          </div>
        </fieldset>
      </Form>
    </div>
  );
};
export default NewGame;