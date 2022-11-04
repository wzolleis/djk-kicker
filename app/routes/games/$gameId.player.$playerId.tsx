import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import { Link, useLoaderData } from "@remix-run/react";
import type { Prisma } from "@prisma/client";
import { getPlayerFeedbackForGame, updateFeedback } from "~/models/feedback.server";
import { Form } from "@remix-run/react";
import type { FeedbackForm } from "~/helpers/formdata/feedback.formdata.server";
import { getFeedbackForm } from "~/helpers/formdata/feedback.formdata.server";
import { updatePlayer } from "~/models/player.server";

export type PlayerFeedbackForGame = Prisma.PlayerGetPayload<{
  include: {
    feedback: {
      where: {
        gameId: string
      }
    }
  }
}>

type LoaderData = {
  player: PlayerFeedbackForGame,
  gameId: string
}

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.gameId, "Help");
  invariant(params.playerId, "Help");
  const gameId = params.gameId;
  const playerId = params.playerId;
  const playerWithFeedback: PlayerFeedbackForGame | null = await getPlayerFeedbackForGame(playerId, gameId);


  return json({ player: playerWithFeedback, gameId });
};


export const action: ActionFunction = async ({ params: { gameId, playerId }, request }) => {
  const formData = await request.formData();
  const submittedForm: FeedbackForm = getFeedbackForm(formData);
  await updateFeedback(playerId!, gameId!, submittedForm.feedback.status, submittedForm.feedback.note);
  await updatePlayer(playerId!, submittedForm.player.name, submittedForm.player.email);
  return redirect(`/games/${gameId}`);

};


const EditPlayerFeedback = () => {
  const { player, gameId } = useLoaderData() as LoaderData;


  // @ts-ignore
  return (
    <section className={"px-3"}>
      <div className={"flex flex-col justify-center items-start"}>
        <p
          className={"font-inter-light bg-gray-200 px-3 mb-1 py-1 rounded text-gray-500 text-item-heading"}>{player.name}</p>
        <div className={"flex font-inter-semibold text-gray-700 text-subheading gap-1"}>
          <Link to={`/games/${gameId}`} className={"text-indigo-700"}>Spiel</Link> /
          <p className={""}>Status
            bearbeiten</p>
        </div>
      </div>
      <Form method={"post"}>
        <main className={"mt-5 flex flex-col gap-4"}>
          <div className={"flex flex-col text-gray-500 font-inter-regular"}>
            <label htmlFor="name">Name</label>
            <input name={"playerName"} id={"playerName"} className={"outline-none border border-gray-300 rounded "}
                   type="text" defaultValue={player.name} />
          </div>
          <div className={"flex flex-col text-gray-500 font-inter-regular"}>
            <label htmlFor="name">Email</label>
            <input name={"playerMail"} id={"playerMail"} className={"outline-none border border-gray-300 rounded "}
                   type="text" defaultValue={player.email} />
          </div>

          <div className={"flex flex-col text-gray-500 font-inter-regular"}>
            <label htmlFor="name">Status</label>
            <select name={"feedbackStatus"} id={"feedbackStatus"}
                    className={"rounded outline-none rounded border border-gray-300 "}
                    defaultValue={player.feedback[0].status === null ? "unknown" : +player.feedback[0].status}>
              <option value={1}>
                Zusage
              </option>
              <option value={0}>
                Absage
              </option>
              <option value={"unknown"}>
                Unbekannt
              </option>
            </select>
          </div>
          <div className={"flex flex-col text-gray-500 font-inter-regular"}>
            <label htmlFor={"feedbackNote"}>Notiz</label>
            <textarea name={"feedbackNote"} id={"feedbackNote"}
                      className={"outline-none border border-gray-300 rounded "}
                      defaultValue={player.feedback[0].note ? player.feedback[0].note : ""} />
          </div>

          <button className={"bg-indigo-500 rounded p-3 text-white font-inter-medium"}>Status speichern</button>

        </main>
      </Form>

    </section>
  );


};

export default EditPlayerFeedback;