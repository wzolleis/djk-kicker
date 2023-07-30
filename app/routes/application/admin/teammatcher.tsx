import {ActionFunction, json, LoaderFunction, redirect} from "@remix-run/node";
import {Form, useLoaderData} from "@remix-run/react";
import {getAllRatings} from "~/models/playerRating.server";
import {PlayerRating} from "@prisma/client";
import PlayerRatingTable from "~/components/ratings/PlayerRatingTable";
import ButtonContainer from "~/components/common/container/ButtonContainer";
import DefaultButton from "~/components/common/buttons/DefaultButton";
import messages from "~/components/i18n/messages";
import {FormWrapper} from "~/utils/formWrapper.server";
import routeLinks from "~/config/routeLinks";

type LoaderData = {
    ratings: PlayerRating[]
}

const PlayerRatingActionValues = ['add'] as const
export type PlayerRatingActionIntent = typeof PlayerRatingActionValues[number]

export const loader: LoaderFunction = async () => {
    const ratings = await getAllRatings()
    return json({ratings})
};

type AddRatingFormFields = 'intent'

export const action: ActionFunction = async ({request}) => {
    const formData = await request.formData();
    const wrapper = new FormWrapper<AddRatingFormFields>(formData)
    const intent = wrapper.get('intent')
    return redirect(routeLinks.admin.ratings.new)
}

const AddRatingButton = () => {
    return (
        <>
            <DefaultButton className={'mb-2 ml-auto'}>
                <button type={'submit'} name={'intent'} value={'add'}>
                    <i className={"fa fa-plus"}/>
                    <span className={"inline px-1"}>{messages.adminPlayerRatingTable.newRating}</span>
                </button>
            </DefaultButton>

        </>

    )
}

const Teammatcher = () => {
    const data = useLoaderData() as unknown as LoaderData

    return (
        <div>
            <Form method={'post'}>
                <ButtonContainer>
                    <AddRatingButton/>
                </ButtonContainer>
                <PlayerRatingTable ratings={data.ratings}/>
            </Form>
        </div>
    )
}

export default Teammatcher