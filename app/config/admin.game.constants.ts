export const spielortOptions = {
    halle: {
        value: 0,
        label: "Halle" //messages.adminEditGameForm.optionHalle
    },
    draussen: {
        value: 1,
        label: "Draussen"
    }
}

const GameStatusValues = ["Absage", "Zusage", "Einladung"] as const
export type GameStatus = typeof GameStatusValues[number]

export const isGameStatus = (value: string): value is GameStatus => {
    return GameStatusValues.some((status) => status === value)
}