import {DefaultFeedback, Player} from "@prisma/client";
import ContentContainer from "~/components/common/container/ContentContainer";
import Subheading from "~/components/common/header/Subheading";
import messages from "~/components/i18n/messages";
import DefaultFeedbackComponent from "~/components/player/feedback/DefaultFeedbackComponent";
import ButtonContainer from "~/components/common/container/ButtonContainer";
import DefaultButton from "~/components/common/buttons/DefaultButton";
import EditProfile from "~/components/dashbaord/editProfile";


const PlayerProfile = ({player, defaultFeedback}: { player: Player, defaultFeedback: DefaultFeedback }) => {
    return (
        <ContentContainer className={"shadow-lg shadow-indigo-500/50"}>
            <Subheading title={messages.dashboard.playerProfile}/>
            <EditProfile player={player}/>
            <hr className="my-8 h-px bg-gray-400 border-0"/>
            <DefaultFeedbackComponent defaultFeedback={defaultFeedback}
                                      title={messages.dashboard.playerDefaultStatus}
            />
            <ButtonContainer className={"flex justify-end my-2 md:my-5"}>
                <DefaultButton className={"ml-auto"}>
                    <button type={"submit"} name={"intent"} value={"playerProfile"}>{messages.buttons.save}</button>
                </DefaultButton>
            </ButtonContainer>
        </ContentContainer>
    )
}

export default PlayerProfile