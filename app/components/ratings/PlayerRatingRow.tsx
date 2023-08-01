import {PlayerRating} from "@prisma/client";
import ButtonContainer from "~/components/common/container/ButtonContainer";
import {Link} from "@remix-run/react";
import routeLinks from "~/config/routeLinks";
import messages from "~/components/i18n/messages";
import RedButton from "~/components/common/buttons/RedButton";
import DefaultButton from "~/components/common/buttons/DefaultButton";

type PlayerRatingRowProps = {
    playerRating: PlayerRating
}

const PlayerRatingRow = ({playerRating}: PlayerRatingRowProps) => {
    const {overall, playerName} = playerRating
    return (
        <>
            <td className={"py-5"}>{playerName}</td>
            <td className={"py-5 text-start"}>{overall}</td>

            <td className={"text-center"}>
                <ButtonContainer className={'flex'}>
                    <DefaultButton>
                        <p className={"fa-solid fa-edit"}/>
                        <Link to={routeLinks.admin.ratings.edit(playerRating.id)}>
                            <span className={'hidden md:block'}>{messages.buttons.edit}</span>
                        </Link>
                    </DefaultButton>
                    <RedButton>
                        <p className={"fa fa-trash "}/>
                        <Link to={routeLinks.admin.ratings.delete(playerRating.id)}>
                            <span className={'hidden md:block'}>{messages.buttons.delete}</span>
                        </Link>
                    </RedButton>
                </ButtonContainer>
            </td>
        </>
    )
}

export default PlayerRatingRow