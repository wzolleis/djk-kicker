import { Form, Link } from "@remix-run/react";


type PlayerFormProps = {
  gameId?: string
}


const PlayerForm = ({gameId }: PlayerFormProps) => {
  return (
    <section className={"px-3"}>
      <div className={"flex flex-col justify-center items-start"}>
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
                   type="text" />
          </div>
          <div className={"flex flex-col text-gray-500 font-inter-regular"}>
            <label htmlFor="name">Email</label>
            <input name={"playerMail"} id={"playerMail"} className={"outline-none border border-gray-300 rounded "}
                   type="text" />
          </div>

          <div className={"flex flex-col text-gray-500 font-inter-regular"}>
            <label htmlFor="name">Status</label>
            <select name={"feedbackStatus"} id={"feedbackStatus"}
                    className={"rounded outline-none rounded border border-gray-300 "}
                    defaultValue={"unknown"}>
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
            />
          </div>

          <button className={"bg-indigo-500 rounded p-3 text-white font-inter-medium"}>Status speichern</button>

        </main>
      </Form>

    </section>
  );
};


export default PlayerForm