import {ItemSelection} from "~/components/selection";
import {RatingWithId} from "~/models/classes/RatingWithId";
import {calculateMatches} from "~/matches/teamCalculation";
import {mapToPlayerModel} from "~/matches/player";

export type MatchListProps = {
    selection: ItemSelection<RatingWithId>
}

const MatchList = ({selection}: MatchListProps) => {
    const players = mapToPlayerModel(selection.includedItems)
    const matches = calculateMatches(players)

    console.log('matches', matches)

    return (
        <div>Matches</div>
    )
}

export default MatchList