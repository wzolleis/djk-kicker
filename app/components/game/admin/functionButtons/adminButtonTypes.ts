export const AdminButtonIntentValues = ['games', 'users', 'ratings', 'server'] as const
export type AdminActionButtonIntent = typeof AdminButtonIntentValues[number]

export const isAdminActionButtonIntent = (value: any): value is AdminActionButtonIntent => {
    return AdminButtonIntentValues.some(intent => intent === value)
}