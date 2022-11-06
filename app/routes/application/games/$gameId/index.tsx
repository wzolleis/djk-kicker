import type {Prisma} from "@prisma/client";
import type {LoaderFunction} from "@remix-run/node";
import {json} from "@remix-run/node";
import invariant from "tiny-invariant";
import {getGameById} from "~/models/games.server";
import {useLoaderData} from "@remix-run/react";
import Players from "~/components/game/Players";
import PageHeader from "~/components/common/PageHeader";
import {useDate} from "~/utils";
import SmallTag from "~/components/common/tags/SmallTag";

export type GameWithFeedback = Prisma.GameGetPayload<{
    include: {
        feedback: {
            include: {
                player: true;
            };
        };
    };
}>;

type LoaderData = {
    game: GameWithFeedback;
};

export const loader: LoaderFunction = async ({params}) => {
    invariant(params.gameId, "Help");
    const gameId = params.gameId;
    const game: GameWithFeedback | null = await getGameById(gameId);
    return json({game});
};

const GameIndex = () => {
    const {game} = useLoaderData<LoaderData>();

    return (
        <section className={"flex flex-col"}>
            <header className={"space-y-2"}>
                <PageHeader title={game.name}/>
                <div className={"flex gap-2"}>
                    <SmallTag text={useDate(game.gameTime)}/>
                    <SmallTag text={useDate(game.id)}/>
                </div>
            </header>
            <Players game={game}></Players>
        </section>
    );
};

export default GameIndex;
