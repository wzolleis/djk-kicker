export const MAX_RATING = 5

export class Rating {
    speed: number
    technik: number
    condition: number

    constructor({speed, technik, condition}: { speed: number, technik: number, condition: number }) {
        this.speed = speed;
        this.technik = technik;
        this.condition = condition;
    }

    total() {
        return 3 * MAX_RATING
    }

    overall() {
        const sumOfSkills = this.speed + this.condition + this.condition
        return Math.ceil((sumOfSkills / this.total()) * 100)
    }
}