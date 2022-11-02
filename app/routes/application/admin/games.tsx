import type { Game} from "~/models/games.server";
import { getGames } from "~/models/games.server";
import type { LoaderArgs } from "@remix-run/node";
import { requireUserId } from "~/session.server";
import { json } from "@remix-run/node";

type LoaderData = {
  events: Awaited<ReturnType<typeof getGames>>
}

export const loader = async ({ request }: LoaderArgs) => {
  await requireUserId(request);

  return json<LoaderData>({
    events: await getGames()
  });
};

type GameListProps = { events: Game[], activeTraining?: string }

const Games = () => {
  return (
    <div>Games!!!</div>
  )
}

export default Games