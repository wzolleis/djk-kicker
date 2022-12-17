import { Form, useFetcher, useLoaderData, useTransition } from "@remix-run/react";
import { findGameById } from "~/models/admin.games.server";
import { ActionFunction, json, LoaderFunction, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import dateUtils from "~/dateUtils";
import messages from "~/components/i18n/messages";
import { getPlayers } from "~/models/player.server";
import routeLinks from "~/helpers/constants/routeLinks";
import { BaseSyntheticEvent, useEffect, useRef, useState } from "react";
import mailhelper from "~/models/admin.games.mails.server";
import PlayerSelector from "~/components/game/forms/PlayerSelector";
import ContentContainer from "~/components/common/container/ContentContainer";
import SmallTag from "~/components/common/tags/SmallTag";
import InputWithLabel from "~/components/common/form/InputWithLabel";
import DefaultButton from "~/components/common/buttons/DefaultButton";
import { configuration } from "~/config";
import RedButton from "~/components/common/buttons/RedButton";
import SelectWithLabel from "~/components/common/form/SelectWithLabel";
import { prisma } from "~/db.server";
import mailLinkBuilder from "~/helpers/mail/mailLinkBuilder";
import { mailContent } from "~/components/i18n/mailcontent";

type LoaderData = {
  game: Awaited<ReturnType<typeof findGameById>>;
  players: Awaited<ReturnType<typeof getPlayers>>;
  hostName: string;
};

export const loader: LoaderFunction = async ({ request, params: { gameId } }) => {
  invariant(gameId, "Expected params.gameId");
  const url = new URL(request.url);
  const hostName = request.headers.get("host")!;
  const [game, players] = await Promise.all([findGameById(gameId), getPlayers()]);
  if (url.searchParams.get("player")) {
    const feedback = await prisma.feedback.findFirstOrThrow({
      where: {
        gameId: gameId,
        playerId: url.searchParams.get("player")!,
      },
    });
    return json(feedback);
  }

  return json<LoaderData>({ game, players, hostName });
};

export const action: ActionFunction = async ({ params: { gameId }, request }) => {
  invariant(gameId, "Expected params.gameId");
  const formData = await request.formData();
  const intent = formData.get("intent");
  if (intent === "invitation") {
    const host = request.headers.get("host")!;
    const playerIds = formData.getAll("receiver") as string[];
    await mailhelper.sendGameInvitation({ host, gameId, playerIds });
    return redirect(routeLinks.admin.game.details(gameId));
  }

  return redirect(configuration.url.links.admin.gamesOverView);
};

const GameInvitation = () => {
  const { game, players, hostName } = useLoaderData<LoaderData>();
  const gameTime = dateUtils.format(new Date(game.gameTime));
  const transition = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const playerToken = useFetcher();
  const [invitationLink, setInvitationLink] = useState("initLink");
  useEffect(() => {
    if (playerToken.type === "init") {
      const playerId = players[0].id;
      playerToken.submit(
        {
          player: playerId,
        },
        {
          method: "get",
        }
      );
    }
    setInvitationLink(() =>
      mailLinkBuilder.gameInvitationLink({
        host: hostName,
        gameId: game.id,
        token: playerToken.data?.invitationToken,
      })
    );
  }, [playerToken.data?.id]);

  return (
    <>
      <div className="flex flex-col gap-2">
        <h1 className={"font-default-bold text-title-large"}>{messages.adminSendInvitationForm.title}</h1>

        <ContentContainer>
          <div className={"flex flex-col items-start justify-center"}>
            <p className={"font-default-bold text-title-large"}>{game.name}</p>
            <div className={"flex gap-2"}>
              <SmallTag text={gameTime}></SmallTag>
              <SmallTag text={configuration.gameLocations[game.spielort as unknown as number]}></SmallTag>
            </div>
          </div>
        </ContentContainer>
        <ContentContainer>
          <Form ref={formRef} method="post">
            <fieldset disabled={transition.state === "submitting"}>
              <div className={"flex flex-col gap-2"}>
                <PlayerSelector players={players} />
                <playerToken.Form method="get">
                  <SelectWithLabel
                    id={"player"}
                    name={"player"}
                    onChange={(event: BaseSyntheticEvent) => {
                      playerToken.submit(event.target.form);
                    }}
                    label={"Spieler"}>
                    {players.map((player) => (
                      <option key={player.id} value={player.id}>
                        {player.name}
                      </option>
                    ))}
                  </SelectWithLabel>
                </playerToken.Form>
                <div className={"flex w-full flex-col gap-1"}>
                  <label className={"font-default-medium text-gray-600"}>{messages.adminGameInvitationForm.invitationLink}</label>
                  <span className={"flex gap-3"}>
                    <div
                      className={"max-w-screen-md overflow-hidden truncate rounded-xl bg-neutral-50 p-3 font-default-medium text-violet-500 ring ring-1 ring-indigo-100"}
                      id={"invitationLink"}>
                      {invitationLink}
                    </div>
                    <DefaultButton>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(invitationLink);
                        }}
                        type={"button"}>
                        Kopieren
                      </button>
                    </DefaultButton>
                  </span>
                </div>
                <InputWithLabel
                  id={"emailSubject"}
                  type={"text"}
                  name={"emailSubject"}
                  label={messages.adminGameInvitationForm.mailSubjectLabel}
                  defaultValue={mailContent.invitationMail.mailSubject(gameTime)}
                />
              </div>
            </fieldset>
            <div className={"mt-5 grid grid-cols-2 justify-end gap-2 md:flex"}>
              <RedButton>
                <img className={"h-6"} src="/img/icons/close-white.png" alt="" />
                <button type="submit" name="intent" value="cancel" disabled={transition.state === "submitting"}>
                  {messages.commonForm.cancel}
                </button>
              </RedButton>
              <DefaultButton>
                <img className={"h-6"} src="/img/icons/mail-check-white.png" alt="" />
                <button type="submit" name="intent" value="invitation" disabled={transition.state === "submitting"}>
                  {messages.adminGameInvitationForm.sendInvitationBtn}
                </button>
              </DefaultButton>
            </div>
          </Form>
        </ContentContainer>
      </div>
    </>
  );
};

export default GameInvitation;
