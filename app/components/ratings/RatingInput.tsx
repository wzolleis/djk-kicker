import classNames from "classnames";
import {RatingSelection, RatingType} from "~/components/ratings/playerRatingTypes";

export type RatingInputProps = {
    label?: string
    selectionChanged?: (selection: RatingSelection) => void
    rating: {
        total: number,
        ratingType: RatingType
        ratingValue: number
    }
}

const RatingInput = ({label, rating: {total, ratingType, ratingValue}, selectionChanged}: RatingInputProps) => {
    const stars: { starPosition: number }[] = []

    for (let i = 0; i < total; i++) {
        stars.push({starPosition: i + 1})
    }

    const handleStarClicked = (selectedStar: number) => {
        if (!!selectionChanged) {
            selectionChanged({
                ratingType,
                ratingValue: selectedStar,
                total
            })
        }
    }

    return (
        <div className={"flex w-full flex-row gap-2"}>
            {!!label &&
                <label className={"font-default-medium text-gray-600 w-1/2 md:w-1/4"}>
                    {label}
                </label>
            }
            {
                stars.map((star) => {
                    return (
                        <i key={star.starPosition}
                           className={classNames("fa fa-star", star.starPosition <= ratingValue ? " text-yellow-500" : "text-gray-500")}
                           onClick={() => handleStarClicked(star.starPosition)}
                        />
                    )
                })
            }
        </div>
    )
}

export default RatingInput