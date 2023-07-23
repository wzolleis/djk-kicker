export type Feature = {
    name: string
    value: string
}

export type FeatureNames = 'teamMatcherEnabled'

export type Features = {
    [key in FeatureNames]: Feature
}

const features: Features = {
    teamMatcherEnabled: {
        name: 'teamMatcherEnabled',
        value: process?.env?.FEATURE_TEAMMATCHER_ACTIVE || 'false'
    }
}

export default features



