import {json, LoaderFunction,} from "@remix-run/node";
import invariant from "tiny-invariant";

type LoaderData = {
};

export const loader: LoaderFunction = async ({
                                                 request,
                                                 params: {gameId},
                                             }) => {
    invariant(gameId, "Expected params.gameId");
    console.log(">>>>>>>>>>>>>> loader")
    return json<LoaderData>({});
};

const GameZusage = () => {
    return (
        <div className="flex w-full flex-col gap-2">
            <h1 className={"font-default-bold text-title-large"}>
                {"Zusage"}
            </h1>
        </div>
    )
};

export default GameZusage;
