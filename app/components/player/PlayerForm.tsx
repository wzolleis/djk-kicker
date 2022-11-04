import { Form, Link } from "@remix-run/react";

type PlayerFormProps = {
  gameId?: string;
};

const PlayerForm = ({ gameId }: PlayerFormProps) => {
  return (
    <section className={"px-3"}>
      <div className={"flex flex-col items-start justify-center"}>
        <div
          className={
            "flex gap-1 font-inter-semibold text-subheading text-gray-700"
          }
        >
          <Link to={`/games/${gameId}`} className={"text-indigo-700"}>
            Spiel
          </Link>{" "}
          /<p className={""}>Spieler Erstellen</p>
        </div>
      </div>
      <Form method={"post"}>
        <main className={"mt-5 flex flex-col gap-4"}>
          <div
            className={"flex flex-col font-inter-regular text-gray-500"}
          >
            <label htmlFor="name">Name</label>
            <input
              name={"playerName"}
              id={"playerName"}
              className={"rounded border border-gray-300 outline-none "}
              type="text"
            />
          </div>
          <div className={"flex flex-col font-inter-regular text-gray-500"}>
            <label htmlFor="name">Email</label>
            <input
              name={"playerMail"}
              id={"playerMail"}
              className={"rounded border border-gray-300 outline-none "}
              type="text"
            />
          </div>

          <div className={"flex flex-col font-inter-regular text-gray-500"}>
            <label htmlFor="name">Status</label>
            <select
              name={"feedbackStatus"}
              id={"feedbackStatus"}
              className={"rounded rounded border border-gray-300 outline-none "}
              defaultValue={"unknown"}
            >
              <option value={1}>Zusage</option>
              <option value={0}>Absage</option>
              <option value={"unknown"}>Unbekannt</option>
            </select>
          </div>
          <div className={"flex flex-col font-inter-regular text-gray-500"}>
            <label htmlFor={"feedbackNote"}>Notiz</label>
            <textarea
              name={"feedbackNote"}
              id={"feedbackNote"}
              className={"rounded border border-gray-300 outline-none "}
            />
          </div>

          <button
            className={"rounded bg-indigo-500 p-3 font-inter-medium text-white"}
          >
            Status speichern
          </button>
        </main>
      </Form>
    </section>
  );
};

export default PlayerForm;
