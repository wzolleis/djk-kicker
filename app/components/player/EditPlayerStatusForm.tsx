import { Form, useNavigate } from "@remix-run/react";
import { getRedactedString } from "~/utils";
import { useState } from "react";
import SetStatusButton from "~/components/common/buttons/SetStatusButton";
import { statusInConfig } from "~/config/status";
import { configuration } from "~/config";
import { PlayerFeedbackForGame } from "~/routes/application/games/$gameId/player/$playerId/index";
import { PlayerCount } from "~/components/common/counter/PlayerCount";

type PlayerFormProps = {
  player: PlayerFeedbackForGame;
  isAuthenticated: boolean;
  onSubmit?: any;
};

const EditPlayerStatusForm = ({ player, isAuthenticated, onSubmit }: PlayerFormProps) => {
  const navigate = useNavigate();
  const [status, setStatus] = useState(player.feedback[0].status ?? statusInConfig.undecided);
  const [playerCount, setPlayerCount] = useState(player.feedback[0].playerCount);

  return (
    <Form method={"post"} onSubmit={onSubmit}>
      <main className={"flex flex-col gap-4"}>
        <div className={"flex flex-col font-poppins-medium text-slate-600"}>
          <label htmlFor="name">Status</label>
          <div>
            <input
              name={"status"}
              id={"status"}
              type={"hidden"}
              className={"rounded-xl  border-none bg-white py-3 outline-none ring ring-1 ring-indigo-100"}
              defaultValue={status}
              disabled={!isAuthenticated}
            />
            <div className={"mt-5 flex w-full items-center justify-start gap-5"}>
              <SetStatusButton
                image={"/img/thumbs-up.png"}
                onClick={() => setStatus(configuration.status.confirmed)}
                isActive={status === configuration.status.confirmed}
                activeColor={"green-500"}
              />
              <SetStatusButton
                image={"/img/thumbs-down.png"}
                onClick={() => setStatus(configuration.status.declined)}
                isActive={status === configuration.status.declined}
                activeColor={"red-500"}
              />
              <SetStatusButton
                image={"/img/thinking.png"}
                onClick={() => setStatus(configuration.status.undecided)}
                isActive={status === configuration.status.undecided}
                activeColor={"yellow-500"}
              />
            </div>
          </div>
        </div>
        <input type="hidden" name={"playerCount"} value={playerCount} />
        <PlayerCount playerCount={playerCount} onAdd={() => setPlayerCount(playerCount + 1)} onSubtract={() => setPlayerCount(playerCount > 1 ? playerCount - 1 : 1)}></PlayerCount>
        <div className={"flex flex-col font-poppins-medium text-slate-600"}>
          <label htmlFor={"feedbackNote"}>Notiz</label>
          <textarea
            name={"note"}
            id={"note"}
            disabled={!isAuthenticated}
            className={"rounded-xl  border-none bg-white py-3 outline-none ring ring-1 ring-indigo-100"}
            defaultValue={player.feedback[0].note || ""}
          />
        </div>
        <button hidden={!isAuthenticated} className={"rounded-xl bg-indigo-600 p-3 font-inter-medium text-white "}>
          Status speichern
        </button>
      </main>
    </Form>
  );
};

export default EditPlayerStatusForm;
