import ButtonContainer from "~/components/common/container/ButtonContainer";
import DefaultButton from "~/components/common/buttons/DefaultButton";
import SubmitButton from "~/components/common/buttons/submitButton";
import messages from "~/components/i18n/messages";
import Subheading from "~/components/common/header/Subheading";
import {Form} from "@remix-run/react";
import InputWithLabel from "~/components/common/form/InputWithLabel";
import SelectWithLabel from "~/components/common/form/SelectWithLabel";
import PlayerRatingList from "~/components/ratings/PlayerRatingList";


export type PlayerStarRatingType = 'Total' | 'Speed' | 'Condition' | 'Technik'

export type PlayerStarRating = {
    ratingType: PlayerStarRatingType
    total: number
    selected: number
    label: string,
    readonly: boolean
}

const PlayerSelect = () => {
    return (
        <SelectWithLabel id={'player'} name={'player'} label={'Spieler'}>
            <option value="0">---</option>
            <option value="1">One</option>
            <option value="2">Two</option>
            <option value="3">Three</option>
            <option value="4">Four</option>
            <option value="5">Five</option>
        </SelectWithLabel>
    )
}

const AddPlayerRatingForm = () => {
    const playerStarRating: PlayerStarRating[] = [
        {
            total: 5,
            selected: 3,
            ratingType: 'Total',
            label: 'Gesamt',
            readonly: true
        },
        {
            total: 5,
            selected: 2,
            ratingType: 'Speed',
            label: 'Geschwindigkeit',
            readonly: false
        },
        {
            total: 5,
            selected: 3,
            ratingType: 'Condition',
            label: 'Kondition',
            readonly: false
        },
        {
            total: 5,
            selected: 3,
            ratingType: 'Technik',
            label: 'Technik',
            readonly: false
        }
    ]

    const starSelectionChanged = (rating: PlayerStarRating) => {
        console.log('Rating clicked', rating)
    }

    return (
        <>
            <PlayerSelect/>
            <InputWithLabel type={"text"} id={"name"} name={"name"} label={"Name"}/>
            <PlayerRatingList selectionChanged={starSelectionChanged} ratings={playerStarRating}/>
        </>
    )
}

const AddPlayerRating = () => {
    return (
        <Form method={"post"} className={"flex flex-col gap-3"}>
            <Subheading title={messages.adminPlayerRatingTable.addRatingTitle}/>
            <AddPlayerRatingForm/>
            <ButtonContainer>
                <DefaultButton className={'ml-auto'}>
                    <img className={"h-6"} src="/img/icons/check.png" alt=""/>
                    <SubmitButton label={messages.buttons.save} showTransitionSpinner={true} name={'intent'} value={'save'}/>
                </DefaultButton>
            </ButtonContainer>
        </Form>
    )
}

export default AddPlayerRating