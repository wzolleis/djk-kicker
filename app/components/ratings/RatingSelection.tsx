import {ItemSelection} from "~/components/selection";
import TransitionContainer from "~/components/common/container/transitionContainer";
import {Form} from "@remix-run/react";
import MainPageContent from "~/components/common/MainPageContent";
import ContentContainer from "~/components/common/container/ContentContainer";
import classNames from "classnames";
import messages from "~/components/i18n/messages";
import ButtonContainer from "~/components/common/container/ButtonContainer";
import DefaultButton from "~/components/common/buttons/DefaultButton";
import React from "react";
import {RatingWithId} from "~/models/classes/RatingWithId";

type ActiveRatingButtonProps = {
    rating: RatingWithId
    onRatingClick: (rating: RatingWithId) => void
    selected: boolean
}
const ActiveRatingButton = ({rating, onRatingClick, selected}: ActiveRatingButtonProps) => {
    return (
        <div onClick={() => onRatingClick(rating)}>
            <div className={classNames({
                "bg-green-200": selected,
                "bg-red-400": !selected,
                "text-white": !selected,
                "text-gray-600": selected,
            }, "flex items-center justify-between border-b")}>
                <div className="p-3 text-lg font-bold">
                    {rating.rating.playerName}
                </div>
            </div>
        </div>
    )
}

const RatingSelection = ({ratings, selection}: { ratings: RatingWithId[], selection: ItemSelection<RatingWithId> }) => {
    return (
        <div className={"min-h-screen"}>
            <TransitionContainer>
                <Form method={"post"}>
                    <input type={"hidden"} value={selection.includedItems.map(p => p.id)} name={"includedPlayers"}/>
                    <MainPageContent>
                        <header className={"flex items-center justify-between"}>
                            <p className={"font-default-medium text-headline-small text-darkblue"}>{"Spieler auswählen"}</p>
                        </header>

                        <ContentContainer className={"mt-3 bg-blue-200"}>
                            <header className={"flex items-center justify-between"}>
                                <p className={"font-default-medium text-headline-small text-darkblue"}>{messages.adminRatingSelectionForm.included}</p>
                            </header>

                            <ButtonContainer>
                                <DefaultButton className={"bg-green-400"}>
                                    <button type='button'
                                            onClick={selection.addAllItemsToIncluded}>{messages.adminRatingSelectionForm.allRatings}</button>
                                </DefaultButton>
                                <DefaultButton className={"bg-red-400"}>
                                    <button type='button'
                                            onClick={selection.removeAllItemsFromIncluded}>{messages.adminRatingSelectionForm.removeAll}</button>
                                </DefaultButton>
                            </ButtonContainer>

                            <main className={"mt-5 flex flex-col gap-3 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"}>
                                {
                                    ratings.map((rating) => {
                                            const selected = selection.isItemIncluded(rating)
                                            return (
                                                <ActiveRatingButton key={rating.id}
                                                                    rating={rating}
                                                                    onRatingClick={selection.handleItemSelection}
                                                                    selected={selected}/>
                                            )
                                        }
                                    )
                                }
                            </main>
                        </ContentContainer>
                    </MainPageContent>
                </Form>
            </TransitionContainer>
        </div>
    )
}

export default RatingSelection