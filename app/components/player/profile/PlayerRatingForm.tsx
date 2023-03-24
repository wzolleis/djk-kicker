import {Player} from "@prisma/client";
import Subheading from "~/components/common/header/Subheading";

export type PlayerRatingFormProps = {
    player: Player
}

const PlayerRatingForm = ({player}: PlayerRatingFormProps) => {
    return (
        <div className={'my-5'}>
            <p className={'fa-solid fa-person-digging'}></p>
            <p className={'fa-solid fa-person-digging'}></p>
            <p className={'fa-solid fa-person-digging'}></p>
            <Subheading title={'Rating - Under construction !!'}/>
            <p className={'fa-solid fa-person-digging'}></p>
            <p className={'fa-solid fa-person-digging'}></p>
            <p className={'fa-solid fa-person-digging'}></p>
        </div>
    )
}
export default PlayerRatingForm