export enum statusInConfig {
    unknown,
    declined,
    confirmed,
    undecided
}

export const istStatusInConfig = (value: number): value is statusInConfig => {
    return value === statusInConfig.unknown
        || value === statusInConfig.declined
        || value === statusInConfig.confirmed
        || value === statusInConfig.undecided
}


const AdminInvitationStatusValues = {
    active: 'active',
    rejected: 'rejected',
    accepted: 'accepted'
}

export type AdminInvitationStatus = keyof typeof AdminInvitationStatusValues

export const isAdminInvitationStatus = (value: string | null): value is AdminInvitationStatus => {
    return !!value && AdminInvitationStatusValues.hasOwnProperty(value)
}

export type statusInConfigKey = keyof typeof statusInConfig