import { useLoaderData } from "@remix-run/react";
import { ActionFunction, json, redirect } from "@remix-run/node";
import CreatePlayerForm from "~/components/player/CreatePlayerForm";
import { getQueryParams } from "~/utils";
import PageHeader from "~/components/common/PageHeader";
import messages from "~/components/i18n/messages";
import MainPageContent from "~/components/common/MainPageContent";
import { createPlayer } from "~/models/player.server";
import { createFeedback } from "~/models/feedback.server";
import invariant from "tiny-invariant";

type LoaderData = {
  gameid: string;
};

export const loader = async ({ request }: { params: any; request: any }) => {
  const { gameid } = getQueryParams(request, "gameid");
  return json({ gameid });
};

export const action: ActionFunction = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const { gameid } = getQueryParams(request, "gameid");
  const playerName = formData.get("name");
  const playerMail = formData.get("mail");
  const playerStatus = formData.get("status");
  const intent = formData.get("intent");
  const note = formData.get("note");

  invariant(typeof intent === "string");
  invariant(typeof playerName === "string");
  invariant(typeof playerMail === "string");
  invariant(typeof playerStatus === "string");
  invariant(typeof note === "string");
  invariant(!!gameid, "GameId must be defined");

  if (intent === "cancel") {
    return redirect(`application/games/${gameid}`);
  }

  const player = await createPlayer(playerName.trim(), playerMail.trim());
  await createFeedback(player.id, gameid, parseInt(playerStatus), note, "adsasd");
  return redirect(`application/games/${gameid}`);
};

const CreatePlayer = () => {
  const { gameid } = useLoaderData<LoaderData>();
  return (
    <>
      <PageHeader title={messages.player.add}></PageHeader>
      <MainPageContent>
        {" "}
        <CreatePlayerForm gameId={gameid} />
      </MainPageContent>
    </>
  );
};

export default CreatePlayer;
