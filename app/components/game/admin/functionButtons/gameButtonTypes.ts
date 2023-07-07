export type ButtonProps = {
    gameId: string
    intent: GameActionButtonIntent
}

export const GameButtonIntentValues = ['edit', 'feedback', 'delete', 'history', 'sendMail'] as const
export type GameActionButtonIntent = typeof GameButtonIntentValues[number]

export const isGameActionButtonIntent = (value: any): value is GameActionButtonIntent => {
    return GameButtonIntentValues.some(intent => intent === value)
}