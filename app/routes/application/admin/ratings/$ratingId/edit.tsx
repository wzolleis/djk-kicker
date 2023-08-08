import {ActionFunction, json, LoaderFunction, redirect} from "@remix-run/node";
import {requireUserId} from "~/session.server";
import invariant from "tiny-invariant";
import {PlayerRating} from "@prisma/client";
import {getPlayerRatingById, updatePlayerRating} from "~/models/playerRating.server";
import {Form, useLoaderData} from "@remix-run/react";
import {PlayerRatingValues, RatingSelection} from "~/components/ratings/playerRatingTypes";
import ButtonContainer from "~/components/common/container/ButtonContainer";
import ShakingContainer from "~/components/common/buttons/ShakingContainer";
import BackButton from "~/components/common/buttons/BackButton";
import messages from "~/components/i18n/messages";
import DefaultButton from "~/components/common/buttons/DefaultButton";
import SubmitButton from "~/components/common/buttons/submitButton";
import {useState} from "react";
import InputWithLabel from "~/components/common/form/InputWithLabel";
import RatingInput from "~/components/ratings/RatingInput";
import {FormWrapper} from "~/utils/formWrapper.server";
import {Rating} from "~/models/classes/Rating";
import routeLinks from "~/config/routeLinks";

type EditRatingFormvalues = 'playerId' | 'name' | 'Technik' | 'Speed' | 'Condition'

type LoaderData = {
    playerRating: PlayerRating
}

export const loader: LoaderFunction = async ({params, request}) => {
    await requireUserId(request);
    invariant(params.ratingId, "expected ratingId in url parameters");
    const ratingId = params.ratingId;
    const playerRating = await getPlayerRatingById(ratingId)

    console.log('>>>>>> playerRating', playerRating)

    invariant(!!playerRating, `Rating mit der Id ${ratingId} nicht gefunden`)
    return json<LoaderData>({playerRating});
};

export const action: ActionFunction = async ({request}: {
    request: Request
}) => {
    await requireUserId(request)
    const formData = await request.formData();
    const wrapper = new FormWrapper<EditRatingFormvalues>(formData)
    const speed = wrapper.get('Speed')
    const name = wrapper.get('name')
    const playerId = wrapper.get('playerId')
    const technik = wrapper.get('Technik')
    const condition = wrapper.get('Condition')

    invariant(typeof speed === 'string')
    invariant(typeof name === 'string')
    invariant(typeof playerId === 'string')
    invariant(typeof technik === 'string')
    invariant(typeof condition === 'string')

    const speedInt = parseInt(speed)
    const technikInt = parseInt(technik)
    const conditionInt = parseInt(condition)

    invariant(Number.isSafeInteger(speedInt))
    invariant(Number.isSafeInteger(technikInt))
    invariant(Number.isSafeInteger(conditionInt))

    const rating = new Rating({speed: speedInt, technik: technikInt, condition: conditionInt})

    await updatePlayerRating(name, {speed: rating.speed, technik: rating.technik, condition: rating.condition, playerName: name, playerId})
    return redirect(routeLinks.admin.teamMatcher)
}

type EditPlayerRatingFormProps = {
    ratingValues: PlayerRatingValues,
    playerName: string
    playerId: string | undefined
}

const EditPlayerRatingForm = ({ratingValues, playerName, playerId}: EditPlayerRatingFormProps) => {

    const [playerRatingValues, setPlayerRatingValues] = useState<PlayerRatingValues>(ratingValues)

    const selectionChanged = (rating: RatingSelection) => {
        const changedRating = {
            ...playerRatingValues,
            [rating.ratingType]: rating
        }
        setPlayerRatingValues(changedRating)
    }

    return (
        <>
            <input hidden={true} name={'Speed'} value={playerRatingValues['Speed'].ratingValue} type={'number'} readOnly/>
            <input hidden={true} name={'Condition'} value={playerRatingValues['Condition'].ratingValue} type={'number'} readOnly/>
            <input hidden={true} name={'Technik'} value={playerRatingValues['Technik'].ratingValue} type={'number'} readOnly/>
            <input hidden={true} name={'playerId'} defaultValue={playerId} type={'text'}/>
            <InputWithLabel type={"text"} id={"name"} name={"name"} label={"Name"} required={true} defaultValue={playerName} disabled={true}/>
            <RatingInput label={messages.adminPlayerRatingTable.ratingTechnik}
                         rating={playerRatingValues['Technik']}
                         selectionChanged={selectionChanged}
            />
            <RatingInput label={messages.adminPlayerRatingTable.ratingSpeed}
                         rating={playerRatingValues['Speed']}
                         selectionChanged={selectionChanged}
            />
            <RatingInput label={messages.adminPlayerRatingTable.ratingCondition}
                         rating={playerRatingValues['Condition']}
                         selectionChanged={selectionChanged}
            />
        </>
    )
}

const EditRating = () => {
    const {playerRating} = useLoaderData<LoaderData>() as unknown as LoaderData

    const ratingValues: PlayerRatingValues = {
        Condition: {
            total: 5,
            ratingValue: playerRating.condition,
            ratingType: 'Condition'
        },
        Technik: {
            total: 5,
            ratingValue: playerRating.technik,
            ratingType: 'Technik'
        },
        Speed: {
            total: 5,
            ratingValue: playerRating.speed,
            ratingType: 'Speed'
        }
    }

    return (
        <Form method={'post'}>
            <EditPlayerRatingForm ratingValues={ratingValues} playerName={playerRating.playerName} playerId={playerRating.playerId ?? undefined}/>
            <ButtonContainer>
                <ShakingContainer>
                    <BackButton label={messages.buttons.back}/>
                </ShakingContainer>
                <DefaultButton className={'ml-auto'}>
                    <img className={"h-6"} src="/img/icons/check.png" alt=""/>
                    <SubmitButton label={messages.buttons.save} name={'intent'} value={'save'}/>
                </DefaultButton>
            </ButtonContainer>
        </Form>
    )
}

export default EditRating