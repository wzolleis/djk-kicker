import {ActionFunction} from "@remix-run/node";
import {requireUserId} from "~/session.server";
import invariant from "tiny-invariant";
import {updatePlayerRating} from "~/models/playerRating.server";
import {Rating} from "~/models/classes/Rating";

export const action: ActionFunction = async ({request}: {
    request: Request
}) => {
    await requireUserId(request)
    const ratingFormValue = (await request.formData()).get('rating')
    invariant(typeof ratingFormValue === 'string')
    const rating = JSON.parse(ratingFormValue) as Rating
    invariant(!!rating.id, 'rating id ist nicht gesetzt')
    invariant(!!rating.playerName, 'playerName ist nicht gesetzt')

    await updatePlayerRating(rating.id, {
        speed: rating.speed,
        technik: rating.technik,
        playerId: null,
        playerName: rating.playerName,
        condition: rating.condition,
        position: rating.position
    })
    return null
}