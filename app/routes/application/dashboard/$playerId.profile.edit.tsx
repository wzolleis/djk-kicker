import InputWithLabel from "~/components/common/form/InputWithLabel";
import messages from "~/components/i18n/messages";
import {Player} from "@prisma/client";

// export const action: ActionFunction = async ({params, request}: { params: Params, request: Request }) => {
//     const playerId = params.playerId;
//     const formData = await request.formData();
//     const playerName = formData.get("name");
//     const playerMail = formData.get("mail");
//     const feedbackStatus = formData.get("feedbackStatus")
//     const note = formData.get("note")
//     const playerCount = formData.get("playerCount")
//
//     invariant(!!playerId, 'playerId missing')
//     invariant(typeof playerName === "string", "playername");
//     invariant(typeof playerMail === "string", "playerMail");
//     invariant(typeof feedbackStatus === "number", "feedbackStatus");
//     invariant(typeof playerCount === "number", "playerCount");
//     invariant(typeof note === "string", "note");
//
//     await updatePlayer(playerId, playerName.trim(), playerMail.trim());
//     await updateDefaultFeedback(playerId, feedbackStatus, playerCount, note)
//
//     return redirect(routeLinks.dashboard);
// };

const EditProfile = ({player}: {player: Player}) => {
    return (
        <div>
            <InputWithLabel
                id={'name'}
                type={'text'}
                name={'name'}
                defaultValue={player.name}
                label={messages.playerProfileForm.name}
            />
            <InputWithLabel
                id={'mail'}
                type={'email'}
                name={'mail'}
                defaultValue={player.email}
                label={messages.playerProfileForm.email}
            />
        </div>
    )
}

export default EditProfile