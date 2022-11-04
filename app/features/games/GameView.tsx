import type { GameActionData } from "~/models/games.server";
import messages from "~/components/i18n/messages";
import dateUtils from "~/dateUtils";


type GameViewProps = {
  defaultValues?: GameActionData
  errors?: GameActionData
}

const GameView = ({ defaultValues }: GameViewProps) => {
  return (
    <>
      <div>
        <label htmlFor="eventTime" className="block mb-2 text-sm font-medium text-gray-900">
          {messages.gamesform.eventTime}
        </label>
        <input type="text"
               id="eventTime"
               name="eventTime"
               required
               autoFocus
               key={defaultValues?.gameTime}
               placeholder={messages.gamesform.eventTime}
               className="border text-sm rounded-lg block w-full p-2.5 border-gray-600 placeholder-gray-400 focus:border-blue-500 border-2"
               defaultValue={defaultValues?.gameTime ?? dateUtils.format(new Date(), { format: "dd.MM.yyyy" })}
        />
      </div>
      <div>
        <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">
          {messages.gamesform.name}
        </label>
        <input type="text"
               id="name"
               name="name"
               required
               key={defaultValues?.name}
               placeholder={messages.gamesform.name}
               className="border text-sm rounded-lg block w-full p-2.5 border-gray-600 placeholder-gray-400 focus:border-blue-500 border-2"
               defaultValue={defaultValues?.name ?? dateUtils.format(new Date(), { format: "dd.MM.yyyy" })}
        />
      </div>
    </>
  );
};

export default GameView;