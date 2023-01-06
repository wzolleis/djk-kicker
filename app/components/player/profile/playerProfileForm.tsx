import {DefaultFeedback, Player} from "@prisma/client";
import InputWithLabel from "~/components/common/form/InputWithLabel";
import messages from "~/components/i18n/messages";
import Subheading from "~/components/common/header/Subheading";
import DefaultFeedbackComponent from "~/components/player/feedback/DefaultFeedbackComponent";
import BodyText from "~/components/common/header/BodyText";

export const PlayerProfileDescription = () => {
    return (
        <>
            <Subheading title={messages.dashboard.playerProfile}/>
            <BodyText title={messages.dashboard.playerProfileDescription_1}/>
            <BodyText title={messages.dashboard.playerProfileDescription_2}/>
        </>
    )
}


const PlayerProfileForm = ({
                                        player,
                                        defaultFeedback,
                                    }: { player: Player, defaultFeedback: DefaultFeedback | undefined}) => {
    return (
        <>
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
        </>
    )
}

export default PlayerProfileForm