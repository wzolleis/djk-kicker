export enum statusInConfig {
    unknown,
    declined,
    confirmed,
    undecided
}

export type statusInConfigKey = keyof typeof statusInConfig