import {Rating} from "~/models/classes/Rating";
import RatingInput from "~/components/ratings/RatingInput";
import {RatingSelection} from "~/components/ratings/playerRatingTypes";

type PlayerRatingInputProps = {
    rating: Rating
    onChange: (rating: Rating) => void
}
const PlayerRatingInput = ({rating, onChange}: PlayerRatingInputProps) => {
    const selectionChanged = ({ratingType, ratingValue}: RatingSelection) => {
        const updatedRating = rating.copyWith(ratingType, ratingValue)
        onChange(updatedRating)
    }

    return (
        <div className={'grid grid-col-2 gap-3'}>
            <RatingInput label={'Speed'}
                         rating={{total: 5, ratingType: 'Speed', ratingValue: rating.speed}}
                         selectionChanged={selectionChanged}
            />
            <RatingInput label={'Technik'}
                         rating={{total: 5, ratingType: 'Technik', ratingValue: rating.technik}}
                         selectionChanged={selectionChanged}
            />
            <RatingInput label='Condition'
                         rating={{total: 5, ratingType: 'Condition', ratingValue: rating.condition}}
                         selectionChanged={selectionChanged}
            />
        </div>
    )
}

export default PlayerRatingInput