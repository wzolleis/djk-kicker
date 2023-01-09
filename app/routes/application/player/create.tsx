import {useLoaderData} from "@remix-run/react";
import {ActionFunction, json, redirect} from "@remix-run/node";
import CreatePlayerForm from "~/components/player/CreatePlayerForm";
import {getQueryParams} from "~/utils";
import PageHeader from "~/components/common/PageHeader";
import messages from "~/components/i18n/messages";
import {createPlayer} from "~/models/player.server";
import {createFeedback} from "~/models/feedback.server";
import invariant from "tiny-invariant";
import routeLinks from "~/config/routeLinks";
import {getGameById} from "~/models/games.server";
import {GameWithFeedback} from "~/config/applicationTypes";
import TransitionContainer from "~/components/common/container/transitionContainer";
import ContentContainer from "~/components/common/container/ContentContainer";
import mailhelper from "~/models/admin.games.mails.server";
import {createEncryptedPlayerToken} from "~/utils/token.server";

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

const sendGameInvitation = async ({
                                      request,
                                      gameId,
                                      playerId
                                  }: { request: Request, gameId: string, playerId: string }) => {
    const host = request.headers.get("host")!;
    await createEncryptedPlayerToken(playerId, gameId);
    await mailhelper.sendGameInvitation({host, gameId, playerIds: [playerId]});
}

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

    let redirectTarget = routeLinks.dashboard

    if (intent === "cancel") {
        redirectTarget = gameid ? routeLinks.game(gameid) : routeLinks.dashboard
    } else {
        const player = await createPlayer(playerName.trim(), playerMail.trim());
        if (!!gameid) {
            invariant(typeof playerStatus === "string", "playerStatus");
            invariant(typeof note === "string", "note");
            await createFeedback(player.id, gameid, parseInt(playerStatus), note);
            await sendGameInvitation({request, gameId: gameid, playerId: player.id})
            redirectTarget = routeLinks.game(gameid);
        }
    }
    return redirect(redirectTarget)
};

const CreatePlayer = () => {
    const {gameid, game} = useLoaderData<LoaderData>();

    return (
        <TransitionContainer>
            <ContentContainer className={"mt-2.5 shadow-lg shadow-blue-400/50"}>
                <PageHeader title={messages.player.add}></PageHeader>
                { /* @ts-ignore */}
                <CreatePlayerForm gameId={gameid} game={game}/>
            </ContentContainer>
        </TransitionContainer>
    );
};

export default CreatePlayer;
