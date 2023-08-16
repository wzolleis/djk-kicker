import {ItemSelection} from "~/components/selection";
import {RatingWithId} from "~/models/classes/RatingWithId";
import {calculateMatches} from "~/matches/teamCalculation";
import {mapToPlayerModel} from "~/matches/player";
import {MatchModel} from "~/matches/teamTypes";

export type MatchListProps = {
    selection: ItemSelection<RatingWithId>
}

const MatchList = ({selection}: MatchListProps) => {
    const players = mapToPlayerModel(selection.includedItems)
    const matches = calculateMatches(players)

    const sortBySkill = (m1: MatchModel, m2: MatchModel) => {
        return m1.diff - m2.diff
    }

    console.log('matches', matches.sort(sortBySkill))

    return (
        <div>Matches</div>
    )
}

export default MatchList