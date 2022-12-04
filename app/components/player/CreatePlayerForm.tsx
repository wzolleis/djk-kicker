import {Form} from "@remix-run/react";
import {config, statusInConfig} from "~/components/i18n/config";
import SetStatusButton from "~/components/common/buttons/status/SetStatusButton";
import {useState} from "react";
import messages from "~/components/i18n/messages";


type PlayerFormProps = {
    gameId?: string;
};

const CreatePlayerForm = ({gameId}: PlayerFormProps) => {

    const [status, setStatus] = useState<statusInConfig>(statusInConfig.unknown);

    return (
        <>
            <Form method={"post"}>
                <main className={"flex flex-col gap-4"}>
                    <div className={"flex flex-col font-poppins-medium text-slate-600"}>
                        <label htmlFor="name">Name</label>
                        <input
                            name={"name"}
                            id={"name"}
                            className="rounded-xl border border-gray-300 bg-white py-3 shadow-lg shadow-indigo-500/20 outline-none"
                            type="text"
                        />
                    </div>
                    <div className={"flex flex-col font-poppins-medium text-slate-600"}>
                        <label htmlFor="mail">Email</label>
                        <input
                            name={"mail"}
                            id={"mail"}
                            className={
                                "rounded-xl border border-gray-300 bg-white py-3 shadow-lg shadow-indigo-500/20 outline-none"
                            }
                            type="email"
                        />
                    </div>

                    {gameId != null &&
                        <>
                            <div className={"flex flex-col font-poppins-medium text-slate-600"}>
                                <label htmlFor="name">Status</label>
                                <div>
                                    <input
                                        name={"status"}
                                        id={"status"}
                                        type={"hidden"}
                                        className={
                                            "rounded-xl  ring ring-1 ring-indigo-100 border-none bg-white py-3 outline-none"
                                        }
                                        defaultValue={status}
                                    />
                                    <div className={"mt-5 flex w-full items-center justify-start gap-5"}>
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
                            <div className={"flex flex-col font-inter-medium text-slate-600"}>
                                <label htmlFor={"feedbackNote"}>Notiz</label>
                                <textarea
                                    name={"note"}
                                    id={"note"}
                                    className={"rounded-xl border border-gray-300 bg-white py-3 shadow-lg shadow-indigo-500/20 outline-none"}/>
                            </div>
                        </>
                    }

                    <button
                        className="rounded-xl bg-indigo-600 p-3 shadow-lg shadow-indigo-500/40 font-inter-medium text-white">
                        {messages.buttons.save}
                    </button>
                </main>
            </Form>
        </>
    );
};

export default CreatePlayerForm;
