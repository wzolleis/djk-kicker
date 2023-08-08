import {Rating} from "~/models/classes/Rating";
import RatingInput from "~/components/ratings/RatingInput";

type PlayerRatingInputProps = {
    rating: Rating
    onChange: (rating: Rating) => void
}
const PlayerRatingInput = ({rating}: PlayerRatingInputProps) => {
    return (
        <div className={'grid grid-col-2 gap-3'}>
            <RatingInput label={'Speed'} rating={{total: 5, ratingType: 'Speed', ratingValue: rating.speed}}/>
            <RatingInput label={'Technik'} rating={{total: 5, ratingType: 'Technik', ratingValue: rating.technik}}/>
            <RatingInput label='Condition' rating={{total: 5, ratingType: 'Condition', ratingValue: rating.condition}}/>
        </div>
    )
}

export default PlayerRatingInput