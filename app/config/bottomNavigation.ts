import {FormWrapper} from "~/utils/formWrapper.server";


const NavigationIntentValues = ["home", "game", "profile",  "administration", "registration", "rescue"] as const
export type NavigationIntent = typeof NavigationIntentValues[number]

const NavigationFormValues = ["intent", "nextGameId", "playerId"] as const
export type NavigationFormFields =  typeof NavigationFormValues[number]


export const getNavigationFormValues = (formData :FormData) => {
    return new FormWrapper<NavigationFormFields>(formData)
}

export const isNavigationIntent = (value: string): value is NavigationIntent => {
    return NavigationIntentValues.some((intent) => intent === value)
}