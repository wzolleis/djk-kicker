import {PlayerRating} from "@prisma/client";

export const MAX_RATING = 5

export class Rating {
    speed: number
    technik: number
    condition: number
    playerName: string | undefined
    id: string | undefined

    constructor({speed, technik, condition, playerName, id}: {
        id?: string,
        speed: number,
        technik: number,
        condition: number,
        playerName?: string
    }) {
        this.speed = speed;
        this.technik = technik;
        this.condition = condition;
        this.playerName = playerName
        this.id = id
    }

    static fromPlayerRating({id, speed, technik, condition, playerName}: PlayerRating) {
        return new Rating({id, speed, technik, condition, playerName})
    }

    total() {
        return 3 * MAX_RATING
    }

    overall() {
        const sumOfSkills = this.speed + this.condition + this.condition
        return Math.ceil((sumOfSkills / this.total()) * 100)
    }
}
