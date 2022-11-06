import type {LoaderFunction} from "@remix-run/node";
import {json} from "@remix-run/node";
import invariant from "tiny-invariant";
import {getGameById} from "~/models/games.server";
import {useLoaderData} from "@remix-run/react";
import Players from "~/components/game/Players";
import PageHeader from "~/components/common/PageHeader";
import {useDate} from "~/utils";
import SmallTag from "~/components/common/tags/SmallTag";
import {FeedBackWithPlayer, GameWithFeedback} from "~/routes/application/games/$gameId";
import {DateTime} from "luxon";
import {Prisma} from "@prisma/client";
import {getPlayersWithUniqueFeedbackForGame, PlayerWithFeedback} from "~/models/player.server";


type LoaderData = {
    game: GameWithFeedback;
    players: PlayerWithFeedback[];
};

export const loader: LoaderFunction = async ({params}) => {
    invariant(params.gameId, "Help");
    const gameId = params.gameId;
    const game: GameWithFeedback | null = await getGameById(gameId);
    const players: PlayerWithFeedback[] = await getPlayersWithUniqueFeedbackForGame(gameId)
    return json({game, players});
};

const GameIndex = () => {
    const {game, players} = useLoaderData<LoaderData>();
    const d = DateTime.fromISO(game.gameTime).toJSDate()


    // @ts-ignore
    return (
        <section className={"flex flex-col"}>
            <header className={"space-y-2"}>
                <div className={"flex justify-between"}>
                    <PageHeader title={game.name}/>
                </div>
                <div className={"flex gap-2"}>
                    <SmallTag text={useDate(d)}/>
                </div>
            </header>
            {/*@ts-ignore*/}
            <Players players={players} gameId={game.id}></Players>
        </section>
    );
};

export default GameIndex;
