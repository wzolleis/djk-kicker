const GameStatusValues = ["Absage", "Zusage", "Einladung"] as const
export type GameStatus = typeof GameStatusValues[number]

export const isGameStatus = (value: string): value is GameStatus => {
    return GameStatusValues.some((status) => status === value)
}