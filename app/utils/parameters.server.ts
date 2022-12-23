import { Params } from "react-router";

export const getCommonParameters = (requestParams: Params, throwError: boolean) => {
  const gameId = requestParams.gameId!;
  if (gameId === undefined && throwError) {
    throw new Error("No Game ID");
  }

  return { gameId };
};
export function getCommonSearchParameters(request: Request) {
  const url = new URL(request.url);
  const gameToken = url.searchParams.get("token") || null;
  return { gameToken };
}
