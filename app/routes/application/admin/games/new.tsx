import { Form, useActionData, useTransition } from "@remix-run/react";
import GameView from "~/features/games/GameView";
import type { GameActionData } from "~/models/games.server";
import messages from "~/components/i18n/messages";
import dateUtils from "~/dateUtils";
import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { requireUserId } from "~/session.server";
import invariant from "tiny-invariant";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const eventTime = formData.get("eventTime")
  const name = formData.get("name")
  const userId = await requireUserId(request);

  invariant(typeof eventTime === "string", "eventTime must be a string");
  invariant(typeof userId === "string", "UserId must be a string");
  invariant(typeof name === "string", "name must be a string");
  invariant(!!userId, "UserId muss gesetzt sein");

  return redirect("application/admin/games");
};

const NewGame = () => {
  const errors = useActionData<GameActionData>();
  const transition = useTransition();
  const defaultValues: GameActionData = {
    gameTime: dateUtils.format(new Date(), { format: "dd.MM.yyyy" }),
    name: dateUtils.format(new Date(), { format: "dd.MM.yyyy" }),
    link: "new"
  }

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
  )
}
export default NewGame