import {useMatchesData} from "~/utils";
import {isDefaultFeedback, isUserAuthentication, UserAuthentication} from "~/config/applicationTypes";
import {DefaultFeedback} from "@prisma/client";

export const useOptionalUserAuthentication = (): UserAuthentication | undefined => {
    const data = useMatchesData("root");
    if (!data || !isUserAuthentication(data.userAuthentication)) {
        return undefined;
    }
    return data.userAuthentication;
}

export const useUserAuthentication = (): UserAuthentication => {
    const maybeUserAuthentication = useOptionalUserAuthentication();
    if (!maybeUserAuthentication) {
        throw new Error("No userAuthentication defined found in root loader, but userAuthentication is required by useUserAuthentication. If userAuthentication is optional, try useOptionalUserAuthentication instead.");
    }
    return maybeUserAuthentication;
}

export const useOptionalDefaultFeedback = (): DefaultFeedback | undefined => {
    const data = useMatchesData("root");
    if (!data || !isDefaultFeedback(data.defaultFeedback)) {
        return undefined
    }

    return data.defaultFeedback
}

export const useDefaultFeedback = (): DefaultFeedback => {
    const maybeDefaultFeedback = useOptionalDefaultFeedback()
    if (!maybeDefaultFeedback) {
        throw new Error("no defaultFeedback defined in root loader")
    }
    return maybeDefaultFeedback
}