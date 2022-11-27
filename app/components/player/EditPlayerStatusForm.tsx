import {Form, useNavigate} from "@remix-run/react";
import type {PlayerFeedbackForGame} from "~/routes/application/games/$gameId/player/$playerId";
import {getRedactedString} from "~/utils";
import {useState} from "react";
import SetStatusButton from "~/components/common/buttons/status/SetStatusButton";
import {config} from "~/components/i18n/config";

type PlayerFormProps = {
    player: PlayerFeedbackForGame;
    isAuthenticated: boolean;
};

const EditPlayerStatusForm = ({player, isAuthenticated}: PlayerFormProps) => {
    const navigate = useNavigate();
    const [status, setStatus] = useState(player.feedback[0].status);

    return (

        <Form method={"post"}>
            <main className={"flex flex-col gap-4"}>
                <div className={"md:grid md:grid-cols-2 gap-4"}>
                    <div className={"flex flex-col font-poppins-medium text-slate-600"}>
                        <label htmlFor="name">Name</label>
                        <input
                            disabled={!isAuthenticated}
                            defaultValue={player.name}
                            name={"playerName"}
                            id={"playerName"}
                            className={
                                "rounded-xl ring ring-1 ring-indigo-100 border-none bg-white py-3 outline-none"
                            }
                            type="text"
                        />
                    </div>
                    <div className={"flex flex-col font-poppins-medium text-slate-600"}>
                        <label htmlFor="name">Email</label>
                        <input
                            disabled={!isAuthenticated}
                            defaultValue={isAuthenticated ? player.email : getRedactedString()}
                            name={"playerMail"}
                            id={"playerMail"}
                            className={
                                "rounded-xl ring ring-1 ring-indigo-100 border-none bg-white py-3 outline-none"
                            }
                            type="text"
                        />
                    </div>
                </div>

                <div className={"flex flex-col font-poppins-medium text-slate-600"}>
                    <label htmlFor="name">Status</label>
                    <div>
                        <input
                            name={"feedbackStatus"}
                            id={"feedbackStatus"}
                            type={"hidden"}
                            className={
                                "rounded-xl  ring ring-1 ring-indigo-100 border-none bg-white py-3 outline-none"
                            }
                            defaultValue={status!}
                            disabled={!isAuthenticated}
                        ></input>

                        <div
                            className={"mt-5 flex w-full items-center justify-start gap-5"}
                        >
                            <SetStatusButton
                                image={"/img/thumbs-up.png"}
                                onClick={() => setStatus(config.status.confirmed)}
                                isActive={status === config.status.confirmed}
                                activeColor={"green-500"}
                            />
                            <SetStatusButton
                                image={"/img/thumbs-down.png"}
                                onClick={() => setStatus(config.status.declined)}
                                isActive={status === config.status.declined}
                                activeColor={"red-500"}
                            />
                            <SetStatusButton
                                image={"/img/thinking.png"}
                                onClick={() => setStatus(config.status.undecided)}
                                isActive={status === config.status.undecided}
                                activeColor={"yellow-500"}
                            />
                        </div>
                    </div>
                </div>
                <div className={"flex flex-col font-poppins-medium text-slate-600"}>
                    <label htmlFor={"feedbackNote"}>Notiz</label>
                    <textarea
                        name={"feedbackNote"}
                        id={"feedbackNote"}
                        disabled={!isAuthenticated}
                        className={
                            "rounded-xl  ring ring-1 ring-indigo-100 border-none bg-white py-3 outline-none"
                        }
                        defaultValue={player.feedback[0].note || ""}
                    />
                </div>

                <button
                    hidden={!isAuthenticated}
                    className={
                        "rounded-xl bg-indigo-600 p-3 font-inter-medium text-white "
                    }
                >
                    Status speichern
                </button>
                <button
                    onClick={() => navigate(-1)}
                    hidden={isAuthenticated}
                    className={
                        "rounded-xl bg-indigo-600 p-3 font-inter-medium text-white "
                    }
                >
                    Zurück
                </button>
            </main>

        </Form>
    );
};

export default EditPlayerStatusForm;
