import {NavLink} from "@remix-run/react";
import messages from "~/components/i18n/messages";
import routeLinks from "~/config/routeLinks";
import {ButtonProps} from "~/components/game/admin/functionButtons/gameButtonTypes";


export const DeleteGameButton = ({gameId}: ButtonProps) => {
    return (
        <NavLink to={`${routeLinks.admin.game.delete(gameId)}`}>
            <button
                className="text-slate-800 hover:text-blue-600 text-sm bg-white hover:bg-slate-100 border border-slate-200 rounded-r-lg font-small md:font-medium px-4 py-2 inline-flex space-x-1 items-center">
                <i className={"fa fa-trash mx-1"}/>
                <span className={"hidden lg:inline"}>{messages.buttons.delete}</span>
            </button>
        </NavLink>
    )
}
