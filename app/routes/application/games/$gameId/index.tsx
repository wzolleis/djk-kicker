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
import type {PlayerWithFeedback} from "~/models/player.server";
import {getPlayersWithUniqueFeedbackForGame} from "~/models/player.server";
import {authenticateUser} from "~/utils/session.server";
import {NoTokenWarning} from "~/components/warnings/NoTokenWarning";
import ContentContainer from "~/components/common/container/ContentContainer";
import ConfirmedPlayersCounter from "~/components/game/feedback/ConfirmedPlayersCounter";
import DeclinedPlayersCounter from "~/components/game/feedback/DeclinedPlayersCounter";
import UnknownPlayersCounter from "~/components/game/feedback/UnknownPlayersCounter";
import UndecidedPlayersCounter from "~/components/game/feedback/UndecidedPlayersCounter";


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
    const {game, players, isAuthenticated} = useLoaderData() as unknown as LoaderData;
    // @ts-ignore
    return (
        <>
            <section className={"flex flex-col gap-5 mt-5"}>
                <ContentContainer>
                    <header className={"space-y-2"}>
                        <div className={"flex justify-between"}>
                            <PageHeader title={game.name}/>
                        </div>
                        <div className={"flex gap-2"}>
                            <SmallTag text={useDate(game.gameTime)}/>
                        </div>
                    </header>
                </ContentContainer>
                <div className={" gap-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4"}>
                    <ContentContainer>
                        <ConfirmedPlayersCounter game={game}/>
                    </ContentContainer>
                    <ContentContainer>
                        <DeclinedPlayersCounter game={game}/>
                    </ContentContainer>
                    <ContentContainer>
                        <UndecidedPlayersCounter game={game}/>
                    </ContentContainer>
                    <ContentContainer>
                        <UnknownPlayersCounter game={game}/>
                    </ContentContainer>
                </div>

                <NoTokenWarning hidden={isAuthenticated}/>
                <Players isAuthenticated={isAuthenticated} players={players} gameId={game.id}></Players>
            </section>
        </>
    );
};

export default GameIndex;
