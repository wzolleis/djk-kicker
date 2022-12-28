import {GameWithFeedback} from "~/config/gameTypes";
import Subheading from "~/components/common/header/Subheading";
import messages from "~/components/i18n/messages";
import ContentContainer from "~/components/common/container/ContentContainer";
import {useDateTime} from "~/utils";
import PlayerCounter from "~/components/game/feedback/PlayerCounter";
import {calculateCompleteNumberOfPlayers} from "~/utils/playerCountHelper";
import {GameFeedbackSummary} from "~/components/game/GameSummary";
import DefaultButton from "~/components/common/buttons/DefaultButton";

const GameSummary = ({nextGame}: { nextGame: GameWithFeedback | null }) => {
    if (!nextGame) return (
        <Subheading title={messages.errors.noGame}/>
    )

    return (
        <ContentContainer className={"mt-2.5 shadow-lg shadow-blue-400/50"}>
            <Subheading title={`${messages.dashboard.nextGame}: ${useDateTime(new Date(nextGame.gameTime))}`}/>
            <div>
                <ContentContainer className="bg-blue-200">
                    <PlayerCounter
                        game={nextGame}
                        calculate={calculateCompleteNumberOfPlayers}
                        title={messages.dashboard.playerAndGuests}
                        counterColor={"text-color-black"}
                    />
                    <GameFeedbackSummary game={nextGame}/>
                    <div className={"flex justify-end mt-3"}>
                        <DefaultButton>
                            <button type={"button"}>{messages.buttons.details}</button>
                            <p className={"fa fa-arrow-circle-right"}/>
                        </DefaultButton>
                    </div>
                </ContentContainer>
            </div>
        </ContentContainer>
    )
}

export default GameSummary