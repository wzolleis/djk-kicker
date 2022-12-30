import type {LoaderFunction} from "@remix-run/node";
import {redirect} from "@remix-run/node";
import {authenticatePlayer} from "~/utils/session.server";
import routeLinks from "~/helpers/constants/routeLinks";

export const loader: LoaderFunction = async ({ params, request }) => {
  const {isAuthenticated} = await authenticatePlayer(params, request);
  if (!isAuthenticated) {
    return redirect(routeLinks.playerNotAuthenticated);
  }
  return redirect(routeLinks.dashboard)
};

const GameIndex = () => {
  return (
      <div>hier ist nichts mehr</div>
  );
};

export default GameIndex;
