import {ActionFunction, json, LoaderFunction, redirect} from "@remix-run/node";
import {Form, useLoaderData} from "@remix-run/react";
import {createRatingForPlayer, getAllRatings} from "~/models/playerRating.server";
import {Player, PlayerRating} from "@prisma/client";
import ButtonContainer from "~/components/common/container/ButtonContainer";
import DefaultButton from "~/components/common/buttons/DefaultButton";
import messages from "~/components/i18n/messages";
import {FormWrapper} from "~/utils/formWrapper.server";
import routeLinks from "~/config/routeLinks";
import invariant from "tiny-invariant";
import {getPlayers} from "~/models/player.server";
import {defaultRating} from "~/components/ratings/playerRatingTypes";
import PlayerRatingList from "~/components/ratings/PlayerRatingList";
import {TabPanel, useTabs} from "react-headless-tabs";
import {TabSelector} from "~/components/common/tabs/TabSelector";
import RatingSelection from "~/components/ratings/RatingSelection";
import {Rating} from "~/models/classes/Rating";
import {ItemSelection, useItemSelectionList} from "~/components/selection";
import {RatingWithId} from "~/models/classes/RatingWithId";
import MatchList from "~/components/ratings/MatchList";

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
    invariant(typeof intent === 'string')
    if (intent === 'add') {
        return redirect(routeLinks.admin.ratings.new)
    } else if (intent === 'playerRatings') {
        const allPlayers: Player[] = await getPlayers()
        const allRatings = await getAllRatings()
        const playerWithoutRating = allPlayers
            .filter(p => !allRatings.some(r => r.playerId === p.id))
        for (let i = 0; i < playerWithoutRating.length; i++) {
            const player = playerWithoutRating[i]
            await createRatingForPlayer(player.id, player.name, defaultRating)
        }
    }
    return redirect(routeLinks.admin.adminLandingPage)
}

const AddRatingButton = () => {
    return (
        <DefaultButton className={'mb-2 ml-auto'}>
            <button type={'submit'} name={'intent'} value={'add'}>
                <i className={"fa fa-plus"}/>
                <span className={"inline px-1"}>{messages.adminPlayerRatingTable.newRating}</span>
            </button>
        </DefaultButton>
    )
}

const AddPlayerRatingsButton = () => {
    return (
        <DefaultButton className={'mb-2'}>
            <button type={'submit'} name={'intent'} value={'playerRatings'}>
                <i className={"fa fa-soccer-ball"}/>
                <span className={"inline px-1"}>{messages.adminPlayerRatingTable.createPlayerRating}</span>
            </button>
        </DefaultButton>
    )
}

const Teammatcher = () => {
    const data = useLoaderData() as unknown as LoaderData
    const [selectedTab, setSelectedTab] = useTabs([
        "Rating",
        "Auswahl",
        "Teams",
    ]);

    const ratings = data.ratings.map((one) => {
        return Rating.fromPlayerRating(one)
    })
    const ratingsWithId: RatingWithId[] = ratings.map((r) => {
        return new RatingWithId({id: r.id!, rating: r})
    })

    const selection: ItemSelection<RatingWithId> = useItemSelectionList({items: ratingsWithId})

    return (
        <div>
            <Form method={'post'}>
                <ButtonContainer>
                    <AddPlayerRatingsButton/>
                    <AddRatingButton/>
                </ButtonContainer>
            </Form>
            <>
                <nav className="flex border-b border-gray-300">
                    <TabSelector
                        isActive={selectedTab === "Rating"}
                        onClick={() => setSelectedTab("Rating")}
                    >
                        Rating
                    </TabSelector>
                    <TabSelector
                        isActive={selectedTab === "Auswahl"}
                        onClick={() => setSelectedTab("Auswahl")}
                    >
                        Auswahl
                    </TabSelector>
                    <TabSelector
                        isActive={selectedTab === "Teams"}
                        onClick={() => setSelectedTab("Teams")}
                    >
                        Teams
                    </TabSelector>
                </nav>
                <div className="p-4">
                    <TabPanel hidden={selectedTab !== "Rating"}>
                        <PlayerRatingList ratings={data.ratings}/>
                    </TabPanel>
                    <TabPanel hidden={selectedTab !== "Auswahl"}>
                        <RatingSelection ratings={ratingsWithId} selection={selection}/>
                    </TabPanel>
                    <TabPanel hidden={selectedTab !== "Teams"}>
                        <MatchList selection={selection}/>
                    </TabPanel>
                </div>
            </>
        </div>
    )
}

export default Teammatcher

