import {Game, Player, User} from "@prisma/client";
import messages from "~/components/i18n/messages";
import GamesTableRow from "~/components/tables/admin/games/GamesTableRow";
import ContentContainer from "~/components/common/container/ContentContainer";


const GamesTable = ({games}: { games: Game[] }) => {
    return <>
        <div className={"h-20"}>
            <ContentContainer>
                <table className=" w-full">
                    <thead className={"mb-4"}>
                    <tr className={"border-b text-left"}>
                        <th className={"py-3"}>{messages.adminGamesTable.name}</th>
                        <th>{messages.adminGamesTable.gametime}</th>
                    </tr>
                    </thead>
                    <tbody className={"mt-5"}>
                    {games.map((game: Game) => (
                        <tr className={"border-b"} key={game.id}>
                            <GamesTableRow game={game}/>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </ContentContainer>
        </div>
    </>
};

export default GamesTable;
