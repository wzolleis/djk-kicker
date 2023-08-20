import {MatchModel} from "~/matches/teamTypes";
import TeamView from "~/components/ratings/TeamView";
import ContentContainer from "~/components/common/container/ContentContainer";
import Subheading from "~/components/common/header/Subheading";
import DefaultButton from "~/components/common/buttons/DefaultButton";

export type MatchViewProps = {
    match: MatchModel
}

const MatchView = ({match}: MatchViewProps) => {
    const team1 = match.teams[0]
    const team2 = match.teams[1]

    const onViewMatchDetails = () => {
    }

    return (
        <ContentContainer className={'grid grid-col-2 bg-blue-200'}>
            <div className={'flex flex-row'}>
                <Subheading className={'col-span-2'} title={`Unterschied: ${match.diff}`}/>
                <DefaultButton className={'ml-auto'}>
                    <button type={"button"} onClick={onViewMatchDetails}>Details</button>
                </DefaultButton>
            </div>
            <ContentContainer className={'my-3 col-span-1 bg-red-200'}>
                <TeamView team={team1}/>
            </ContentContainer>
            <ContentContainer className={'col-span-1 bg-green-200'}>
                <TeamView team={team2}/>
            </ContentContainer>
        </ContentContainer>
    )
}

export default MatchView