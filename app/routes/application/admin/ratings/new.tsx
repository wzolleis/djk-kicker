import ButtonContainer from "~/components/common/container/ButtonContainer";
import DefaultButton from "~/components/common/buttons/DefaultButton";
import SubmitButton from "~/components/common/buttons/submitButton";
import messages from "~/components/i18n/messages";
import Subheading from "~/components/common/header/Subheading";
import {Form} from "@remix-run/react";
import InputWithLabel from "~/components/common/form/InputWithLabel";
import {PlayerRatingValues, RatingSelection} from "~/components/ratings/playerRatingTypes";
import RatingInput from "~/components/ratings/RatingInput";
import {useState} from "react";
import BackButton from "~/components/common/buttons/BackButton";
import ShakingContainer from "~/components/common/buttons/ShakingContainer";
import TransitionContainer from "~/components/common/container/transitionContainer";
import {ActionFunction, redirect} from "@remix-run/node";
import {requireUserId} from "~/session.server";
import {FormWrapper} from "~/utils/formWrapper.server";
import routeLinks from "~/config/routeLinks";
import invariant from "tiny-invariant";
import {createRating} from "~/models/playerRating.server";
import {Rating} from "~/models/classes/Rating";

type RatingFormvalues = 'name' | 'Technik' | 'Speed' | 'Condition'

const AddPlayerRatingForm = () => {
    const playerRatings: PlayerRatingValues = {
        Speed: {
            ratingType: 'Speed',
            total: 5,
            ratingValue: 3
        },
        Condition: {
            ratingValue: 2,
            total: 5,
            ratingType: 'Condition'
        },
        Technik: {
            ratingType: 'Technik',
            total: 5,
            ratingValue: 1
        }
    }

    const [playerRatingValues, setPlayerRatingValues] = useState<PlayerRatingValues>(playerRatings)

    const selectionChanged = (rating: RatingSelection) => {
        const changedRating = {
            ...playerRatingValues,
            [rating.ratingType]: rating
        }
        setPlayerRatingValues(changedRating)
    }

    return (
        <>
            <input hidden={true} name={'Speed'} value={playerRatingValues['Speed'].ratingValue} type={'number'}/>
            <input hidden={true} name={'Condition'} value={playerRatingValues['Condition'].ratingValue} type={'number'}/>
            <input hidden={true} name={'Technik'} value={playerRatingValues['Technik'].ratingValue} type={'number'}/>

            <InputWithLabel type={"text"} id={"name"} name={"name"} label={"Name"} required={true}/>
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

export const action: ActionFunction = async ({request}: { request: Request }) => {
    await requireUserId(request)
    const formData = await request.formData();
    const wrapper = new FormWrapper<RatingFormvalues>(formData)
    const speed = wrapper.get('Speed')
    const name = wrapper.get('name')
    const technik = wrapper.get('Technik')
    const condition = wrapper.get('Condition')

    invariant(typeof speed === 'string')
    invariant(typeof name === 'string')
    invariant(typeof technik === 'string')
    invariant(typeof condition === 'string')

    const speedInt = parseInt(speed)
    const technikInt = parseInt(technik)
    const conditionInt = parseInt(condition)

    invariant(Number.isSafeInteger(speedInt))
    invariant(Number.isSafeInteger(technikInt))
    invariant(Number.isSafeInteger(conditionInt))

    const rating = new Rating({speed: speedInt, technik: technikInt, condition: conditionInt})

    await createRating(name, rating)
    return redirect(routeLinks.admin.teamMatcher)
}

const AddPlayerRating = () => {
    return (
        <TransitionContainer>
            <Form method={"post"} className={"flex flex-col gap-3"}>
                <Subheading title={messages.adminPlayerRatingTable.addRatingTitle}/>
                <AddPlayerRatingForm/>
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
        </TransitionContainer>
    )
}

export default AddPlayerRating