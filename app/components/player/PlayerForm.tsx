import {Form, Link} from "@remix-run/react";
import {PlayerFeedbackForGame} from "~/routes/application/games/$gameId/player/$playerId";

type PlayerFormProps = {
    player: PlayerFeedbackForGame;
};

const PlayerForm = ({player}: PlayerFormProps) => {
    return (
        <Form method={"post"}>
            <main className={"flex flex-col gap-4"}>
                <div className={"flex flex-col font-poppins-medium text-slate-600"}>
                    <label htmlFor="name">Name</label>
                    <input
                        defaultValue={player.name}
                        name={"playerName"}
                        id={"playerName"}
                        className={
                            "rounded-xl border border-gray-300 bg-white shadow shadow-indigo-500/20 outline-none py-3"
                        }
                        type="text"
                    />
                </div>
                <div className={"flex flex-col font-poppins-medium text-slate-600"}>
                    <label htmlFor="name">Email</label>
                    <input
                        defaultValue={player.email}
                        name={"playerMail"}
                        id={"playerMail"}
                        className={"rounded-xl border border-gray-300 bg-white shadow shadow-indigo-500/20 outline-none py-3"}
                        type="text"
                    />
                </div>

                <div className={"flex flex-col font-poppins-medium text-slate-600"}>
                    <label htmlFor="name">Status</label>
                    <select
                        name={"feedbackStatus"}
                        id={"feedbackStatus"}
                        className={"rounded-xl border border-gray-300 bg-white shadow shadow-indigo-500/20 outline-none py-3"}
                        defaultValue={
                            player.feedback[0].status === null
                                ? "unknown"
                                : +player.feedback[0].status
                        }
                    >
                        <option value={1}>Zusage</option>
                        <option value={0}>Absage</option>
                        <option value={"unknown"}>Unbekannt</option>
                    </select>
                </div>
                <div className={"flex flex-col font-inter-medium text-slate-600"}>
                    <label htmlFor={"feedbackNote"}>Notiz</label>
                    <textarea
                        name={"feedbackNote"}
                        id={"feedbackNote"}
                        className={"rounded-xl border border-gray-300 bg-white shadow shadow-indigo-500/20 outline-none py-3"}
                        defaultValue={player.feedback[0].note || ""}
                    />
                </div>

                <button
                    className={"rounded bg-indigo-500 p-3 font-inter-medium text-white"}
                >
                    Status speichern
                </button>
            </main>
        </Form>
    );
};

export default PlayerForm;
