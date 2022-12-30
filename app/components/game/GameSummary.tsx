import ContentContainer from "~/components/common/container/ContentContainer";
import {useDateTime} from "~/utils";
import PlayerCounter from "~/components/game/feedback/PlayerCounter";
import {calculateCompleteNumberOfPlayers} from "~/utils/playerCountHelper";
import ConfirmedPlayersCounter from "~/components/game/feedback/ConfirmedPlayersCounter";
import DeclinedPlayersCounter from "~/components/game/feedback/DeclinedPlayersCounter";
import UndecidedPlayersCounter from "~/components/game/feedback/UndecidedPlayersCounter";
import UnknownPlayersCounter from "~/components/game/feedback/UnknownPlayersCounter";
import {GameWithFeedback} from "~/config/gameTypes";
import messages from "~/components/i18n/messages";
import Subheading from "~/components/common/header/Subheading";


export const GameFeedbackSummary = ({game}: { game: GameWithFeedback }) => {
    return (
        <div className={"mt-5 grid grid-cols-2 gap-4 md:grid-cols-4"}>
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

const GameSummary = ({game}: { game: GameWithFeedback }) => {
    return (
        <>
            <ContentContainer>
                <header className={"space-y-2"}>
                    <div className={"grid grid-cols-2 gap-5"}>
                        <div className={"bg-blue-200"}>
                            <div className={"m-5"}>
                                <Subheading title={`${useDateTime(game.gameTime)}`}/>
                                <p className={"text-label-medium md:text-label-large text-gray-500 font-default-medium"}>
                                    {`${messages.commonForm.spielort(game.spielort)}`}
                                </p>
                            </div>
                        </div>
                        <ContentContainer className={"bg-blue-200"}>
                            <PlayerCounter
                                game={game}
                                calculate={calculateCompleteNumberOfPlayers}
                                title={"Spieler insgesamt"}
                                counterColor={"text-color-black"}
                            />
                        </ContentContainer>
                    </div>
                </header>
            </ContentContainer>
            <GameFeedbackSummary game={game}/>
        </>
    )
}
export default GameSummary