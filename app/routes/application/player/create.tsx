import {useLoaderData} from "@remix-run/react";
import {ActionFunction, json, redirect} from "@remix-run/node";
import CreatePlayerForm from "~/components/player/CreatePlayerForm";
import {getQueryParams} from "~/utils";
import PageHeader from "~/components/common/PageHeader";
import messages from "~/components/i18n/messages";
import MainPageContent from "~/components/common/MainPageContent";
import {createPlayer} from "~/models/player.server";
import {createFeedback} from "~/models/feedback.server";
import invariant from "tiny-invariant";
import routeLinks from "~/helpers/constants/routeLinks";
import {getGameById} from "~/models/games.server";
import {GameWithFeedback} from "~/config/gameTypes";
import TransitionContainer from "~/components/common/container/transitionContainer";

type LoaderData = {
    gameid: string;
    game?: GameWithFeedback
};

export const loader = async ({request}: { params: any; request: any }) => {
    const {gameid} = getQueryParams(request, "gameid");
    if (!!gameid) {
        const game: GameWithFeedback | null = await getGameById(gameid)
        const gameWithFeedback = game ?? undefined
        return json({gameid, game: gameWithFeedback});
    }

    return json({gameid});
};

export const action: ActionFunction = async ({
                                                 request,
                                             }: {
    request: Request;
}) => {
    const formData = await request.formData();
    const {gameid} = getQueryParams(request, "gameid");
    const playerName = formData.get("name");
    const playerMail = formData.get("mail");
    const playerStatus = formData.get("status");
    const intent = formData.get("intent");
    const note = formData.get("note");

    invariant(typeof intent === "string", "intent");
    invariant(typeof playerName === "string", "name");
    invariant(typeof playerMail === "string", "mail");

    if (intent === "cancel") {
        return gameid ? redirect(routeLinks.game(gameid)) : redirect(routeLinks.dashboard)
    }
    const player = await createPlayer(playerName.trim(), playerMail.trim());
    if (!!gameid) {
        invariant(typeof playerStatus === "string", "playerStatus");
        invariant(typeof note === "string", "note");
        await createFeedback(player.id, gameid, parseInt(playerStatus), note);
        return redirect(routeLinks.game(gameid));
    }

    redirect(routeLinks.dashboard)
};

const CreatePlayer = () => {
    const {gameid, game} = useLoaderData<LoaderData>();

    return (
        <TransitionContainer>
            <PageHeader title={messages.player.add}></PageHeader>
            <MainPageContent>
                { /* @ts-ignore */}
                <CreatePlayerForm gameId={gameid} game={game}/>
            </MainPageContent>
        </TransitionContainer>
    );
};

export default CreatePlayer;
