import { Params } from "react-router";

export const getCommonParameters = (
    requestParams: Params,
    throwError: boolean
) => {
    const gameId = requestParams.gameId!;
    if (gameId === undefined && throwError) {
        throw new Error("No Game ID");
    }

    return { gameId };
};
export function getCommonSearchParameters(request: Request) {
    const url = new URL(request.url);
    const token = url.searchParams.get("token") || null;
    return { token };
}

export function getQueryParameter(
    request: Request,
    queryString: string,
    require = false
) {
    const url = new URL(request.url);
    const query = url.searchParams.get(queryString);
    if (require && !query) {
        throw new Error(`Please provide query parameter ${queryString}`);
    }
    return query || undefined;
}
