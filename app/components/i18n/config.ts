export enum statusInConfig {
    unknown,
    declined,
    confirmed,
    undecided
}


type statusInConfigType = {
    [key: string]: number
}

export type statusInConfigKey = keyof typeof statusInConfig


export const config = {
    status: statusInConfig
}

