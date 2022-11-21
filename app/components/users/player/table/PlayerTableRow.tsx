import type {Player} from "@prisma/client";
import {Link} from "@remix-run/react";
import messages from "~/components/i18n/messages";

export type AdminTableRowProps = {
    player: Player;
};

const AdminTableRow = ({player}: AdminTableRowProps) => {
    return (
        <>
            <td className={"py-5 "}>{player.name}</td>
            <td className={"text-indigo-500 underline"}>
                <a href={`mailto:${player.email}`}>{player.email}</a>
            </td>
            <td className={"text-right"}>
                <Link
                    to={`edit/?player=${player.id}`}
                    className={
                        "rounded bg-indigo-500 shadow shadow-lg  shadow-indigo-500/40 px-3 py-2 font-sans  text-white "
                    }
                >{messages.buttons.edit}
                </Link>
            </td>
        </>
    );
};

export default AdminTableRow;
