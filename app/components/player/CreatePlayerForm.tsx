import {Form} from "@remix-run/react";
import SetStatusButton from "~/components/common/buttons/SetStatusButton";
import {useState} from "react";
import messages from "~/components/i18n/messages";
import {statusInConfig} from "~/config/status";
import {configuration} from "~/config";
import InputWithLabel from "~/components/common/form/InputWithLabel";
import RedButton from "~/components/common/buttons/RedButton";
import DefaultButton from "~/components/common/buttons/DefaultButton";


type PlayerFormProps = {
    gameId?: string;
};

const CreatePlayerForm = ({gameId}: PlayerFormProps) => {

    const [status, setStatus] = useState<statusInConfig>(statusInConfig.unknown);

    return (
        <>
            <Form method={"post"}>
                <main className={"flex flex-col gap-4"}>
                    <InputWithLabel id={'name'} type={'text'} name={'name'} label={messages.createPlayerForm.name}/>
                    <InputWithLabel id={'mail'} type={'email'} name={'mail'} label={messages.createPlayerForm.email}/>
                    {gameId != null &&
                        <>
                            <div className={"flex flex-col font-poppins-medium text-slate-600"}>
                                <label htmlFor="name">Status</label>
                                <div>
                                    <input
                                        name={"status"}
                                        id={"status"}
                                        type={"hidden"}
                                        defaultValue={status}
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
                            <div className={"flex flex-col font-inter-medium text-slate-600"}>
                                <label htmlFor={"feedbackNote"}>Notiz</label>
                                <textarea
                                    name={"note"}
                                    id={"note"}
                                    className={"rounded-xl border border-gray-300 bg-white py-3 shadow-lg shadow-indigo-500/20 outline-none"}/>
                            </div>
                        </>
                    }
                    <div className={"flex justify-start gap-2 pt-2"}>
                        <RedButton>
                            <button name='intent' value={'cancel'} type={'submit'}>{messages.buttons.cancel}</button>
                        </RedButton>
                        <DefaultButton className={'ml-auto'}>
                            <button name={'intent'} value={'save'}>{messages.buttons.save}</button>
                        </DefaultButton>
                    </div>
                </main>
            </Form>
        </>
    );
};

export default CreatePlayerForm;
