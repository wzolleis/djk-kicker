import ButtonContainer from "~/components/common/container/ButtonContainer";
import DefaultButton from "~/components/common/buttons/DefaultButton";
import SubmitButton from "~/components/common/buttons/submitButton";
import messages from "~/components/i18n/messages";
import Subheading from "~/components/common/header/Subheading";
import {Form} from "@remix-run/react";
import InputWithLabel from "~/components/common/form/InputWithLabel";
import {RatingSelection, RatingType} from "~/components/ratings/playerRatingTypes";
import RatingInput from "~/components/ratings/RatingInput";
import {useState} from "react";

type PlayerRatingValues = {
    [key in RatingType]: {
        ratingValue: number;
        ratingType: RatingType,
        total: number
    };
};
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
        console.log('Rating clicked', rating)
        const changedRating = {
            ...playerRatingValues,
            [rating.ratingType]: rating
        }
        setPlayerRatingValues(changedRating)
    }

    return (
        <>
            <InputWithLabel type={"text"} id={"name"} name={"name"} label={"Name"}/>
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