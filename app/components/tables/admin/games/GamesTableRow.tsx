import {Game} from "@prisma/client";
import {Link} from "@remix-run/react";
import messages from "~/components/i18n/messages";
import {useDate} from "~/utils";
import {DateTime} from "luxon";


const GamesTableRow = ({game}: { game: Game }) => {
    return (
        <>
            <td className={"py-5"}>{game.name}</td>
            <td>{DateTime.fromISO(new Date(game.gameTime).toISOString()).toFormat('dd.MM.yyyy - hh:mm')}
            </td>
            <td>
                {game.spielort}
            </td>
            <td className={"text-right"}>
                <Link
                    to={`${game.id}`}
                    className={
                        "rounded bg-indigo-100 px-3 py-2 text-indigo-600 ring ring-1 ring-indigo-600 mr-10"
                    }
                >{messages.buttons.edit}
                </Link>
            </td>
        </>
    );

}

export default GamesTableRow;