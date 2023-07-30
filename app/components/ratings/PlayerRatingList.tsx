import classNames from "classnames";
import {PlayerStarRating} from "~/routes/application/admin/ratings/new";
import {useState} from "react";

export type RatingWithLabelProps = {
    ratings: PlayerStarRating[]
    selectionChanged: (selection: PlayerStarRating) => void
}

const Rating = ({rating, handleRatingClicked}: { rating: PlayerStarRating, handleRatingClicked: (rating: PlayerStarRating) => void }) => {
    const stars: { starPosition: number }[] = []

    const [selectedStars, setSelectedStars] = useState(rating.selected)
    for (let i = 0; i < rating.total; i++) {
        stars.push({starPosition: i + 1})
    }

    const handleStarClicked = (selectedStar: number) => {
        setSelectedStars(selectedStar)
        handleRatingClicked({
            ...rating,
            selected: selectedStar
        })
    }

    return (
        <div className={"flex w-full flex-row gap-2 my-5"}>
            <label className={"font-default-medium text-gray-600 w-1/2 md:w-1/4"}>
                {rating.label}
            </label>
            <div>
                {
                    stars.map((star) => {
                        return (
                            <i key={star.starPosition}
                               className={classNames("fa fa-star", star.starPosition <= selectedStars ? " text-yellow-500" : "text-gray-500")}
                               onClick={() => handleStarClicked(star.starPosition)}
                            />
                        )
                    })
                }
            </div>
        </div>
    )
}

const PlayerRatingList = ({ratings, selectionChanged}: RatingWithLabelProps) => {
    const handleRatingClicked = (rating: PlayerStarRating) => {
        selectionChanged(rating)
    }

    return (
        <div className="flex items-center flex-col gap-2">
            {
                ratings.map((rating) => {
                    return (
                        <Rating key={rating.ratingType} rating={rating} handleRatingClicked={handleRatingClicked}/>
                    )
                })
            }
        </div>
    )
}

export default PlayerRatingList