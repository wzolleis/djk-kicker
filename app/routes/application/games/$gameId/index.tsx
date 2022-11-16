import type {LoaderFunction} from "@remix-run/node";
import {json} from "@remix-run/node";
import invariant from "tiny-invariant";
import {getGameById} from "~/models/games.server";
import {useLoaderData} from "@remix-run/react";
import Players from "~/components/game/Players";
import PageHeader from "~/components/common/PageHeader";
import {useDate} from "~/utils";
import SmallTag from "~/components/common/tags/SmallTag";
import type {GameWithFeedback} from "~/routes/application/games/$gameId";
import {DateTime} from "luxon";
import type {PlayerWithFeedback} from "~/models/player.server";
import {getPlayersWithUniqueFeedbackForGame} from "~/models/player.server";
import {authenticateUser} from "~/utils/session.server";
import {NoTokenWarning} from "~/components/warnings/NoTokenWarning";


type LoaderData = {
    game: GameWithFeedback;
    players: PlayerWithFeedback[],
    isAuthenticated: boolean;
};

export const loader: LoaderFunction = async ({params, request}) => {
    invariant(params.gameId, "Help");
    const gameId = params.gameId;
    const game: GameWithFeedback | null = await getGameById(gameId);
    const players: PlayerWithFeedback[] = await getPlayersWithUniqueFeedbackForGame(gameId)
    const {isAuthenticated, cookieHeader} = await authenticateUser(params, request);
    return json({game, players, isAuthenticated},
        {
            headers: {
                'Set-Cookie': cookieHeader
            }
        });
};

const GameIndex = () => {
    const {game, players, isAuthenticated} = useLoaderData<LoaderData>();
    // @ts-ignore
    return (
        <>
            <section className={"flex flex-col gap-5"}>
                <header className={"space-y-2"}>
                    <div className={"flex justify-between"}>
                        <PageHeader title={game.name}/>
                    </div>
                    <div className={"flex gap-2"}>
                        <SmallTag text={useDate(DateTime.fromISO(game.gameTime).toJSDate())}/>
                    </div>
                </header>
                <NoTokenWarning hidden={isAuthenticated}/>
                <Players players={players} gameId={game.id}></Players>
            </section>
        </>
    );
};

export default GameIndex;
