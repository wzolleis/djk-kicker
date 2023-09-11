import {MatchModel} from "~/matches/teamTypes";
import TeamView from "~/components/ratings/TeamView";
import ContentContainer from "~/components/common/container/ContentContainer";
import Subheading from "~/components/common/header/Subheading";
import DefaultButton from "~/components/common/buttons/DefaultButton";
import messages from "~/components/i18n/messages";
import {useState} from "react";
import SoccerField from "~/components/ratings/soccerField";
import Modal from "~/components/common/modal/Modal";

export type MatchViewProps = {
    match: MatchModel
    matchIndex: number
}

const MatchView = ({match, matchIndex}: MatchViewProps) => {
    const team1 = match.teams[0]
    const team2 = match.teams[1]

    const [open, setOpen] = useState(false);

    const onViewMatchDetails = () => {
        setOpen(true)
    }

    const onCloseMatchDetails = () => {
        setOpen(false)
    }

    const matchName = `Spiel: ${matchIndex + 1}`

    return (
        <>
            <div className={'grid grid-col-2 bg-blue-200 p-3'}>
                <div className={'flex flex-row'}>
                    <Subheading className={'col-span-2'} title={matchName}/>
                    <DefaultButton className={'ml-auto'}>
                        <button type={"button"} onClick={onViewMatchDetails}>{messages.buttons.details}</button>
                    </DefaultButton>
                </div>
                <ContentContainer className={'my-3 col-span-1 bg-red-200'}>
                    <TeamView team={team1}/>
                </ContentContainer>
                <ContentContainer className={'col-span-1 bg-green-200'}>
                    <TeamView team={team2}/>
                </ContentContainer>
            </div>
            <Modal title={matchName} show={open} onClose={onCloseMatchDetails}>
                <SoccerField home={match.home()} away={match.away()}/>
            </Modal>
        </>
    )
}

export default MatchView