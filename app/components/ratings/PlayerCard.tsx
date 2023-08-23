import {Rating} from "~/models/classes/Rating";
import {ChangeEvent, useMemo, useState} from "react";
import {playerImageByRating} from "~/components/ratings/playerRatingImage";
import {useFetcher} from "@remix-run/react";
import PlayerRatingInput from "~/components/ratings/PlayerRatingInput";
import _ from "lodash";
import messages from "~/components/i18n/messages";
import {configuration} from "~/config";
import {isPlayerPosition} from "~/components/ratings/playerRatingTypes";

export type PlayerCardProps = {
    rating: Rating
}

const isSelectable = (value: string) => {
    return Object.keys(configuration.playerPositions).some(position => position === value)
}


const PositionSuggestions = ({onChange, name, currentValue}: { onChange: (value: string) => void, name: string, currentValue: string }) => {
    const defaultValue = isSelectable(currentValue) ? currentValue : undefined
    return (
        <div className={"grid grid-cols-3 py-1 px-3"}>
            <label
                htmlFor={`${name}`}
                className="mb-2 block md:font-medium text-gray-400"
            >
                {messages.editRatingForm.position}
            </label>
            <select className={"text-gray-400 rounded-lg border-2 border-gray-600 col-span-2 mr-2"}
                    id={name}
                    name={name}
                    defaultValue={defaultValue}
                    onChange={(event: ChangeEvent<HTMLSelectElement>) => onChange(event.target.value)}
            >
                {
                    Object.keys(configuration.playerPositions).map(key => {
                        if (isPlayerPosition(key)) {
                            return <option key={key} value={key}>{configuration.playerPositions[key]}</option>
                        }
                    })
                }
            </select>
        </div>
    )
}

const PlayerCard = ({rating}: PlayerCardProps) => {

    const image = useMemo(() => playerImageByRating({rating: rating.overall()}), [rating])
    const fetcher = useFetcher();
    const [ratingValue, setRatingValue] = useState(rating)
    const [position, setPosition] = useState(rating.position)

    const onRatingChanged = (changed: Rating) => {
        setRatingValue(changed)
        fetcher.submit({rating: JSON.stringify(changed)}, {method: 'POST', action: `/application/admin/ratings/${rating.id}/edit`});
    }

    const onPositionChanged = (position: string) => {
        setPosition(position)
        const changed = rating.copyWithPosition({position})
        onRatingChanged(changed)
        debouncedRatingChanged(changed)
    }

    const debouncedRatingChanged = _.debounce(onRatingChanged, 1000)

    return (
        <fetcher.Form>
            <input name='rating' type={'hidden'} value={JSON.stringify(ratingValue)}/>
            <div className="grid grid-cols-2 m-3 rounded-lg bg-blue-200 md:max-w-xl md:flex-row">
                <div className={'grid grid-cols-3 col-span-2 m-5 md:w-full pr-5 md:pr-2'}>
                    <img src={image} alt=""
                         className="mx-3 h-24 w-24 md:h-32 md:w-32 mr-5 col-span-2"
                    />
                    <div className={'w-20 h-20 rounded-full flex m-5 md:m-2 justify-center items-center bg-white text-black'}>
                        <h2 className={'font-default-bold text-title-large tracking-tighter text-black'}>{`${ratingValue.overall()}`}</h2>
                    </div>
                </div>
                <div className={'col-span-2'}>
                    <h5 className="px-3 text-xl font-medium text-neutral-800">
                        {rating.playerName}
                    </h5>
                    <div>
                        <PositionSuggestions onChange={onPositionChanged} name={`position-suggestions`} currentValue={position}/>
                    </div>
                    <div className="flex flex-col justify-start p-6 mb-4 text-base text-neutral-600">
                        <PlayerRatingInput rating={ratingValue} onChange={onRatingChanged}/>
                    </div>
                </div>
            </div>
        </fetcher.Form>
    )
}

export default PlayerCard