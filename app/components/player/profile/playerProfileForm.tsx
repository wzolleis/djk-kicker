import {DefaultFeedback, Player} from "@prisma/client";
import messages from "~/components/i18n/messages";
import Subheading from "~/components/common/header/Subheading";
import DefaultFeedbackComponent from "~/components/player/feedback/DefaultFeedbackComponent";
import BodyText from "~/components/common/header/BodyText";
import ContentContainer from "~/components/common/container/ContentContainer";

export const PlayerProfileDescription = () => {
    return (
        <>
            <Subheading title={messages.dashboard.playerProfile}/>
            <BodyText title={messages.dashboard.playerProfileDescription_1}/>
            <BodyText title={messages.dashboard.playerProfileDescription_3}/>
            <div className={'bg-red-400 p-5 my-3 font-default-bold text-body small md:text-xl text-white tracking-tighter'}>
                <section>
                    {messages.dashboard.playerProfileWarning_1}
                </section>
                <section>
                    {messages.dashboard.playerProfileWarning_2}
                </section>
            </div>
        </>
    )
}


const PlayerProfileForm = ({
                               player,
                               defaultFeedback,
                           }: { player: Player, defaultFeedback: DefaultFeedback | undefined }) => {
    return (
        <>
            <ContentContainer>
                <div className={"flex flex-col items-start px-3 py-2"}>
                    <p className={"text-label-medium text-gray-500 font-default-medium"}>{player.name} - {player.email}</p>
                </div>
            </ContentContainer>
            <hr className="my-8 h-px bg-gray-400 border-0"/>
            <DefaultFeedbackComponent defaultFeedback={defaultFeedback}
                                      title={messages.dashboard.playerDefaultStatus}
            />
        </>
    )
}

export default PlayerProfileForm