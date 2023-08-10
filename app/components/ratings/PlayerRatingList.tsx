import {PlayerRating} from "@prisma/client";
import ContentContainer from "~/components/common/container/ContentContainer";
import {Rating} from "~/models/classes/Rating";
import PlayerRatingInput from "~/components/ratings/PlayerRatingInput";
import {useMemo, useState} from "react";
import {useFetcher} from "@remix-run/react";
import {ActionArgs} from "@remix-run/node";
import invariant from "tiny-invariant";

export type PlayerRatingListProps = {
    ratings: PlayerRating[]
}

const getImage = (overall: number) => {
    if (overall > 80) {
        return "/img/players/player_100_3.svg"
    } else if (overall > 50) {
        return "/img/players/player_50.svg"
    } else {
        return "/img/players/player_20.svg"
    }
}

type PlayerCardProps = {
    rating: Rating
}

export async function action({request}: ActionArgs) {
    const ratingFormValue = (await request.formData()).get('rating')
    invariant(typeof ratingFormValue === 'string')
    const rating = JSON.parse(ratingFormValue)
    console.log('>>>>>>>>> rating =', rating)
    return null
}

const PlayerCard = ({rating}: PlayerCardProps) => {

    const image = useMemo(() => getImage(rating.overall()), [rating])
    const fetcher = useFetcher();
    const [ratingValue, setRatingValue] = useState(rating)

    const onRatingChanged = (changed: Rating) => {
        setRatingValue(changed)
        fetcher.submit({rating: JSON.stringify(changed)}, {method: 'POST', action: `/application/admin/ratings/${rating.id}/edit`});
    }

    return (
        <fetcher.Form>
            <input name='rating' type={'hidden'} value={JSON.stringify(ratingValue)}/>
            <div className="grid grid-cols-2 m-3 rounded-lg bg-blue-200 md:max-w-xl md:flex-row">
                <div className={'grid grid-cols-3 col-span-2 m-5 md:w-full'}>
                    <img src={image} alt=""
                         className="mx-3 h-24 w-24 md:h-32 md:w-32 mr-5 col-span-2"
                    />
                    <div className={'w-20 h-20 rounded-full flex m-5 justify-center items-center bg-white text-black mr-5'}>
                        <h2 className={'font-default-bold text-title-large tracking-tighter text-black'}>{`${ratingValue.overall()}`}</h2>
                    </div>
                </div>
                <div className={'col-span-2'}>
                    <h5 className="px-3 text-xl font-medium text-neutral-800">
                        {rating.playerName}
                    </h5>
                    <div className="flex flex-col justify-start p-6 mb-4 text-base text-neutral-600">
                        <PlayerRatingInput rating={ratingValue} onChange={onRatingChanged}/>
                    </div>
                </div>
            </div>
        </fetcher.Form>
    )
}

const PlayerRatingList = ({ratings}: PlayerRatingListProps) => {
    const sortedRatings = ratings
        .map(Rating.fromPlayerRating)
        .sort((r1, r2) => r2.overall() - r1.overall())

    return (
        <ContentContainer>
            <ul>
                {
                    sortedRatings.map(rating => {
                        return (
                            <li key={rating.id}>
                                <PlayerCard rating={rating}/>
                            </li>
                        )
                    })
                }
            </ul>
        </ContentContainer>
    )
}

export default PlayerRatingList