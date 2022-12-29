import {DefaultFeedback, Player} from "@prisma/client";
import InputWithLabel from "~/components/common/form/InputWithLabel";
import messages from "~/components/i18n/messages";
import ContentContainer from "~/components/common/container/ContentContainer";
import Subheading from "~/components/common/header/Subheading";
import DefaultFeedbackComponent from "~/components/player/feedback/DefaultFeedbackComponent";
import ButtonContainer from "~/components/common/container/ButtonContainer";
import DefaultButton from "~/components/common/buttons/DefaultButton";


const DashboardPlayerProfileForm = ({player, defaultFeedback}: { player: Player, defaultFeedback: DefaultFeedback }) => {
    return (
        <ContentContainer className={"shadow-lg shadow-indigo-500/50"}>
            <Subheading title={messages.dashboard.playerProfile}/>
            <div>
                <InputWithLabel
                    id={'name'}
                    type={'text'}
                    name={'dashboard.profile.player.name'}
                    defaultValue={player.name}
                    label={messages.playerProfileForm.name}
                />
                <InputWithLabel
                    id={'mail'}
                    type={'email'}
                    name={'dashboard.profile.player.email'}
                    defaultValue={player.email}
                    label={messages.playerProfileForm.email}
                />
            </div>
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

export default DashboardPlayerProfileForm