import {Link, Outlet} from "@remix-run/react";
import {LoaderFunction, redirect} from "@remix-run/node";
import invariant from "tiny-invariant";
import routeLinks from "~/helpers/constants/routeLinks";

export const loader: LoaderFunction = async ({params: {gameId}}) => {
    invariant(gameId, "Expected params.gameId");
    return redirect(routeLinks.admin.game.actions(gameId))
};

const GameIndex = () => {
    return (
        <>
            <div>
                <Link className={"flex justify-start items-center"} to="actions">
                    <div className={"p-3 shadow-lg shadow-indigo-500/40 rounded-full pr-2"}>
                        <img src="/img/arrow-indigo.png" className={"h-4 w-4"} alt=""/>
                    </div>
                    <span className={"pl-2"}>History</span>
                </Link>
            </div>
            <Outlet/>
        </>
    )
}

export default GameIndex