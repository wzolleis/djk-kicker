import {Form, Link} from "@remix-run/react";


type PlayerFormProps = {
    gameId?: string;
};

const CreatePlayerForm = ({gameId}: PlayerFormProps) => {


    return (
        <>
            <Form method={"post"}>
                <main className={"flex flex-col gap-4"}>
                    <div className={"flex flex-col font-poppins-medium text-slate-600"}>
                        <label htmlFor="name">Name</label>
                        <input
                            name={"name"}
                            id={"name"}
                            className={
                                "rounded-xl border border-gray-300 bg-white py-3 shadow-lg shadow-indigo-500/20 outline-none"
                            }
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
                            type="text"
                        />
                    </div>

                    {gameId != null &&
                        <>
                            <div className={"flex flex-col font-poppins-medium text-slate-600"}>
                                <label htmlFor="status">Status</label>
                                <select
                                    name={"status"}
                                    id={"status"}
                                    className={"rounded-xl border border-gray-300 bg-white py-3 shadow-lg shadow-indigo-500/20 outline-none"}
                                    defaultValue={"unknown"}
                                >
                                    <option value={1}>Zusage</option>
                                    <option value={0}>Absage</option>
                                    <option value={"unknown"}>Unbekannt</option>
                                </select>
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
                        className={"rounded-xl bg-indigo-600 p-3 shadow-lg shadow-indigo-500/40 font-inter-medium text-white"}
                    >
                        Status speichern
                    </button>
                </main>
            </Form>
        </>
    );
};

export default CreatePlayerForm;
