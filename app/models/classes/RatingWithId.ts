import {DataWithId} from "~/components/selection";
import {Rating} from "~/models/classes/Rating";

export class RatingWithId implements DataWithId {
    rating: Rating
    id: string

    constructor({rating, id}: { rating: Rating, id: string }) {
        this.id = id
        this.rating = rating
    }
}