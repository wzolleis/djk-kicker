import {Game} from "@prisma/client";
import GameCard from "~/components/game/GameCard";
import {Link} from "@remix-run/react";
import DefaultButton from "~/components/common/buttons/DefaultButton";
import messages from "~/components/i18n/messages";
import routeLinks from "~/helpers/constants/routeLinks";

type GamesListProps = {
    games: Game[];
}


const GamesList = ({games}: GamesListProps) => {

    return (
        <>
            <section className={"flex flex-col gap-2"}>
                {games.map((game) => (
                    <GameCard key={game.id} game={game}>
                        <div className={"flex flex-row gap-2"}>
                        <Link
                            to={routeLinks.admin.game.edit(game.id)}>
                            <DefaultButton>
                                <p className={'fa fa-edit'}/>
                                <span>{messages.buttons.edit}</span>
                            </DefaultButton>
                        </Link>
                        </div>
                    </GameCard>
                ))}
            </section>
        </>
    )
}

export default GamesList;