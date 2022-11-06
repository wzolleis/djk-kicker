import type {ActionFunction, LoaderFunction} from "@remix-run/node";
import {json, redirect} from "@remix-run/node";
import invariant from "tiny-invariant";
import ErrorView from "~/components/errorhandling/ErrorView";
import {Form, useCatch, useLoaderData, useSubmit, useTransition,} from "@remix-run/react";
import CatchView from "~/components/errorhandling/CatchView";
import messages from "~/components/i18n/messages";
import {deleteGame, findGameById, updateGame,} from "~/models/admin.games.server";
import {requireUserId} from "~/session.server";
import type {Game} from "@prisma/client";
import {dateTimeLocalInputValueToDateTime, dateTimeToDateTimeLocalInputFormValue,} from "~/utils";
import {DateTime} from "luxon";
import toast from "react-hot-toast";
import {useEffect, useRef} from "react";
import mailSender from "~/helpers/mail/mailsender";

type LoaderData = {
    game: Awaited<ReturnType<typeof findGameById>>;
};

export const loader: LoaderFunction = async ({params: {gameId}}) => {
    invariant(gameId, "Expected params.gameId");
    return json<LoaderData>({
        game: await findGameById(gameId),
    });
};

const sendTestMail = async () => {
    await mailSender()
}


export const action: ActionFunction = async ({
                                                 params: {gameId},
                                                 request,
                                             }) => {
    const formData = await request.formData();

    const name = formData.get("name");
    const gameTime = formData.get("gameTime");
    const userId = await requireUserId(request);
    const intent = formData.get("intent");
    const spielort = formData.get("spielort");
    const validSpielort =
        typeof spielort === "string" && !Number.isNaN(parseInt(spielort, 10));

    invariant(typeof gameId === "string", "GameId must be a string");
    invariant(typeof userId === "string", "UserId must be a string");
    invariant(typeof name === "string", "name must be a string");
    invariant(typeof gameTime === "string", "gameTime must be a string");
    invariant(!!userId, "UserId muss gesetzt sein");
    invariant(!!gameId, "GameId muss gesetzt sein");
    invariant(validSpielort, "Der Wert von Spielort muss eine Zahl sein");


    if (intent === "delete") {
        await deleteGame(gameId);
        return redirect("application/admin/games");
    }

    if (intent === 'email') {
        await sendTestMail()
    }

    if (intent === 'update') {
        // update
        const toUpdate: Game = {
            id: gameId,
            name,
            gameTime: dateTimeLocalInputValueToDateTime(gameTime).toJSDate(),
            link: null, // todo
            spielort,
        };
        await updateGame(toUpdate);
    }
    return redirect("/application/admin/games");
};

const notify = (message: string) => {
    toast(message);
};

const EditGame = () => {
    const {game} = useLoaderData<LoaderData>();
    const transition = useTransition();
    const formRef = useRef<HTMLFormElement>(null);
    const submit = useSubmit();

    useEffect(() => {
        if (formRef.current) {
            // initialisiere die Select-Box mit dem Wert des Spielorts wenn ein Game geladen wurde
            // @ts-ignore
            formRef.current.elements["spielort"].value = game.spielort;
        }
    }, [game]);

    const isUpdating = transition.submission?.formData.get("intent") === "update";
    const isDeleting = transition.submission?.formData.get("intent") === "delete";

    const handleDelete = (event: any) => {
        if (confirm(messages.adminEditGameForm.deleteConfirmation)) {
            notify(messages.adminEditGameForm.gameDeleted);
            submit(event.currentTarget);
        }
    };

    return (
        <div className="mb-6 grid gap-6 bg-gray-300 px-4 md:grid-cols-2">
            <div className="pt-2 font-poppins-semibold md:col-span-2">
                {messages.adminEditGameForm.title}
            </div>
            <Form ref={formRef} method="post" className="pt-2">
                <fieldset disabled={transition.state === "submitting"}>
                    <div>
                        <label
                            htmlFor="name"
                            className="mb-2 block text-sm font-medium text-gray-900"
                        >
                            {messages.adminGamesForm.name}
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            placeholder={messages.adminEditGameForm.name}
                            className="block w-full rounded-lg border border-2 border-gray-600 p-2.5 text-sm placeholder-gray-400 focus:border-blue-500"
                            defaultValue={game.name}
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="eventTime"
                            className="mb-2 block pt-2 text-sm font-medium text-gray-900"
                        >
                            {messages.adminEditGameForm.gameTime}
                        </label>
                        <input
                            type="datetime-local"
                            id="gameTime"
                            name="gameTime"
                            required
                            autoFocus
                            placeholder={messages.adminEditGameForm.gameTime}
                            className="block w-full rounded-lg border border-2 border-gray-600 p-2.5 text-sm placeholder-gray-400 focus:border-blue-500"
                            defaultValue={dateTimeToDateTimeLocalInputFormValue(
                                DateTime.fromISO(game.gameTime)
                            )}
                        />
                    </div>
                    <div className={"flex flex-col"}>
                        <label
                            className="mb-2 block pt-2 text-sm font-medium text-gray-900"
                            htmlFor="spielort"
                        >
                            {messages.adminEditGameForm.spielort}
                        </label>
                        <select
                            name="spielort"
                            id="spielort"
                            className="rounded rounded border border-gray-300 outline-none"
                        >
                            <option value={"0"}>
                                {messages.adminEditGameForm.optionHalle}
                            </option>
                            <option value={"1"}>
                                {messages.adminEditGameForm.optionDraussen}
                            </option>
                        </select>
                    </div>

                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            className="mr-2 mb-2 mt-2 rounded bg-red-500 py-2 px-2 text-white hover:bg-blue-600 focus:border-2 disabled:bg-red-300"
                            name="intent"
                            value="delete"
                            disabled={isDeleting}
                            onClick={handleDelete}
                        >
                            {transition.state === "submitting"
                                ? messages.adminEditGameForm.deleting
                                : messages.adminEditGameForm.delete}
                        </button>
                        <button
                            type="submit"
                            className="mr-2 mb-2 mt-2 rounded bg-blue-500 py-2 px-2 text-white hover:bg-blue-600 focus:border-2 disabled:bg-blue-300"
                            name="intent"
                            value="update"
                            disabled={isUpdating}
                        >
                            {transition.state === "submitting"
                                ? messages.adminEditGameForm.updating
                                : messages.adminEditGameForm.update}
                        </button>
                        <button
                            type="submit"
                            className="rounded mb-2 mt-2 bg-gray-600 py-2 px-2 text-white hover:bg-blue-600 focus:border-2 disabled:bg-blue-300"
                            name="intent"
                            value="email"
                            disabled={isUpdating}
                        >
                            Test-Mail
                        </button>
                    </div>
                </fieldset>
            </Form>
        </div>
    );
};

export const ErrorBoundary = ({error}: { error: Error }) => {
    return <ErrorView error={error}/>;
};

export const CatchBoundary = () => {
    const caught = useCatch();
    const {statusText, status} = caught;
    return (
        <CatchView
            statusText={statusText}
            status={status}
            caught={caught}
            description={"Fehler bei der Verwaltung des Spiels"}
        />
    );
};

export default EditGame;
