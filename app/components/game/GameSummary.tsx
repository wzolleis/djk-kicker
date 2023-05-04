import ContentContainer from "~/components/common/container/ContentContainer";
import {useDateTime} from "~/utils";
import PlayerCounter from "~/components/game/feedback/PlayerCounter";
import {calculateCompleteNumberOfPlayers, calculateNumberOfGuests} from "~/utils/playerCountHelper";
import ConfirmedPlayersCounter from "~/components/game/feedback/ConfirmedPlayersCounter";
import DeclinedPlayersCounter from "~/components/game/feedback/DeclinedPlayersCounter";
import UndecidedPlayersCounter from "~/components/game/feedback/UndecidedPlayersCounter";
import UnknownPlayersCounter from "~/components/game/feedback/UnknownPlayersCounter";
import {GameWithFeedback} from "~/config/applicationTypes";
import messages from "~/components/i18n/messages";
import classNames from "classnames";


export const GameFeedbackSummary = ({game}: { game: GameWithFeedback }) => {
    return (
        <div className={"mt-5 grid grid-cols-2 gap-4 md:grid-cols-4"}>
            <ContentContainer>
                <PlayerCounter
                    game={game}
                    calculate={calculateCompleteNumberOfPlayers}
                    title={"Insgesamt"}
                    counterColor={"text-blue-500"}
                />
            </ContentContainer>
            <ContentContainer>
                <PlayerCounter
                    game={game}
                    calculate={calculateNumberOfGuests}
                    title={"Gäste"}
                    counterColor={"text-gray-200"}
                />
            </ContentContainer>
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
    )
}

const GameDate = ({date}: { date: Date }) => {
    const title = useDateTime(date)
    return (
        <section>
            <div className={classNames("font-default-bold text-title-large tracking-tighter")}>{title}</div>
        </section>
    )
}

const GameSummary = ({game}: { game: GameWithFeedback }) => {
    return (
        <>
            <ContentContainer className={"bg-white col-span-2"}>
                <div className={"grid grid-cols-2 gap-5 m-2"}>
                    <GameDate date={game.gameTime}/>
                    <p className={"text-title-large font-default-medium"}>
                        {`${messages.commonForm.spielort(game.spielort)}`}
                    </p>
                </div>
            </ContentContainer>
            <GameFeedbackSummary game={game}/>
        </>
    )
}
export default GameSummary