import {FormWrapper} from "~/utils/formWrapper.server";


const NavigationIntentValues = ["home", "game", "profile",  "administration", "registration"] as const
export type NavigationIntent = typeof NavigationIntentValues[number]

export type NavigationFormValues = "intent"

export const getNavigationFormValues = (formData :FormData) => {
    return new FormWrapper<NavigationFormValues>(formData)
}

export const isNavigationIntent = (value: string): value is NavigationIntent => {
    return NavigationIntentValues.some((intent) => intent === value)
}