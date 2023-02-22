import {NavLink} from "@remix-run/react";
import messages from "~/components/i18n/messages";
import {ButtonProps} from "~/components/game/admin/functionButtons/gameButtonTypes";

export const GameActionHistoryButton = ({gameId}: ButtonProps) => {
    return (
        <NavLink to={`${gameId}/actionHistory`} className={"ml-auto"}>
            <button
                className="text-slate-800 hover:text-blue-600 text-sm bg-white hover:bg-slate-100 border border-slate-200 font-small md:font-medium px-4 py-2 inline-flex space-x-1 items-center">
                <i className={"fa-solid fa-timeline mx-1 text-blue-500"}/>
                <span className={"hidden lg:inline text-blue-500"}>{messages.buttons.actionHistory}</span>
            </button>
        </NavLink>
    )
}
