import {ItemSelection} from "~/components/selection";
import {RatingWithId} from "~/models/classes/RatingWithId";
import {calculateMatches} from "~/matches/teamCalculation";
import {mapToPlayerModel} from "~/matches/player";
import {MatchModel} from "~/matches/teamTypes";
import ContentContainer from "~/components/common/container/ContentContainer";
import MatchView from "~/components/ratings/MatchView";

export type MatchListProps = {
    selection: ItemSelection<RatingWithId>
}

const MatchList = ({selection}: MatchListProps) => {
    const players = mapToPlayerModel(selection.includedItems)
    const matches = calculateMatches(players)

    const sortBySkill = (m1: MatchModel, m2: MatchModel) => {
        return m1.diff - m2.diff
    }

    const sortedMatches = matches.sort(sortBySkill)

    return (
        <ContentContainer>
            <ul>
                {
                    sortedMatches.map((match, index) => {
                        return (
                            <li key={match.id} className={'my-2 shadow-gray-200'}>
                                <MatchView match={match} matchIndex={index}/>
                            </li>
                        )
                    })
                }
            </ul>
        </ContentContainer>
    )
}

export default MatchList