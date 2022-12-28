import {Player} from "@prisma/client";
import InputWithLabel from "~/components/common/form/InputWithLabel";
import messages from "~/components/i18n/messages";

const EditProfile = ({player}: {player: Player}) => {
    return (
        <div>
            <InputWithLabel
                id={'name'}
                type={'text'}
                name={'dashboard.profile.player.name'}
                defaultValue={player.name}
                label={messages.playerProfileForm.name}
            />
            <InputWithLabel
                id={'mail'}
                type={'email'}
                name={'dashboard.profile.player.email'}
                defaultValue={player.email}
                label={messages.playerProfileForm.email}
            />
        </div>
    )
}
export default EditProfile