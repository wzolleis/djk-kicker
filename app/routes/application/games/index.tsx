import type {LoaderFunction} from "@remix-run/node";
import {redirect} from "@remix-run/node";
import {authenticatePlayer} from "~/utils/session.server";
import routeLinks from "~/config/routeLinks";

export const loader: LoaderFunction = async ({ request }) => {
  const {isAuthenticated} = await authenticatePlayer(request);
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
