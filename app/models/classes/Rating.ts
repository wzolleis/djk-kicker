import {PlayerRating} from "@prisma/client";
import {RatingType} from "~/components/ratings/playerRatingTypes";

export const MAX_RATING = 5

export class Rating {
    speed: number
    technik: number
    condition: number
    playerName: string | undefined
    id: string | undefined
    position: string

    constructor({speed, technik, condition, position, playerName, id}: {
        id?: string,
        speed: number,
        technik: number,
        condition: number,
        playerName?: string
        position: string
    }) {
        this.speed = speed;
        this.technik = technik;
        this.condition = condition;
        this.playerName = playerName
        this.id = id
        this.position = position
    }

    copyWith(ratingType: RatingType, value: number) {
        const values = {
            speed: this.speed,
            condition: this.condition,
            technik: this.technik,
            id: this.id,
            playerName: this.playerName,
            position: this.position
        }

        switch (ratingType) {
            case 'Technik':
                values.technik = value
                break
            case 'Speed':
                values.speed = value
                break
            case 'Condition':
                values.condition = value
                break
        }

        return new Rating(values)
    }

    copyWithPosition({position}: { position: string }) {
        return new Rating({
            ...this,
            position
        })
    }

    static fromPlayerRating({id, speed, technik, condition, position, playerName}: PlayerRating) {
        return new Rating({id, speed, technik, condition, position, playerName})
    }

    total() {
        return 3 * MAX_RATING
    }

    overall() {
        const sumOfSkills = this.speed + this.condition + this.technik
        return Math.ceil((sumOfSkills / this.total()) * 100)
    }
}
