import { ActionFunction, json, LoaderFunction, redirect } from "@remix-run/node";
import { AdminInvitation } from "@prisma/client";
import { Form, useActionData, useCatch, useLoaderData, useNavigate } from "@remix-run/react";
import { DateTime } from "luxon";
import { getAdminInvitation, updateAdminInvitation } from "~/models/admin.user.invitation.server";
import { decryptEncryptedAdminToken } from "~/utils/token.server";
import routeLinks from "~/helpers/constants/routeLinks";
import { Params } from "react-router";
import invariant from "tiny-invariant";
import { createUser, getUserByEmail } from "~/models/user.server";
import PageHeader from "~/components/common/PageHeader";
import messages from "~/components/i18n/messages";
import InputWithLabel from "~/components/common/form/InputWithLabel";
import dateUtils from "~/dateUtils";
import ButtonContainer from "~/components/common/container/ButtonContainer";
import RedButton from "~/components/common/buttons/RedButton";
import DefaultButton from "~/components/common/buttons/DefaultButton";
import React from "react";

type LoaderData = {
  adminInvitation: AdminInvitation;
};

type AdminToken = {
  email: string;
  expires_at: string;
};

type InviteUserResponseErrors = {
  adminName: string | null;
  password: string | null;
  passwordRepeat: string | null;
};

export const action: ActionFunction = async ({ params, request }: { params: Params; request: Request }) => {
  const formData = await request.formData();
  const adminName = formData.get("adminName");
  const password = formData.get("password");
  const passwordRepeat = formData.get("passwordRepeat");
  const inviteId = params.inviteId;

  invariant(typeof inviteId === "string", "Keine Einladung in der URL enthalten");
  invariant(typeof password === "string", "Passwort fehlt");
  invariant(typeof adminName === "string", "Name fehlt");

  const invitation = await getAdminInvitation(inviteId);
  invariant(!!invitation, `Einladung mit der ID "${inviteId}" nicht gefunden`);
  const userByMail = await getUserByEmail(invitation.email);
  invariant(!userByMail, "Es existiert bereits ein Anwender für diese Mail-Adresse");

  const errors: InviteUserResponseErrors = {
    adminName: adminName ? null : "Name eingeben",
    password: password ? null : "Passwort eingeben",
    passwordRepeat: password === passwordRepeat ? null : "Passwort stimmt nicht überein",
  };
  const hasErrors = Object.values(errors).some((errorMessage) => errorMessage);
  if (hasErrors) {
    return json(errors);
  }

  await createUser(invitation.email, password);
  await updateAdminInvitation(inviteId, { invitationStatus: "accepted", name: invitation.name });

  return redirect(routeLinks.admin.users.home);
};

export const loader: LoaderFunction = async ({ params, request }) => {
  const inviteId = params.inviteId;
  if (!inviteId || inviteId === "undefined") {
    throw new Response("Keine Einladungsid im Link", {
      status: 400,
      statusText: `Die Einladung "${inviteId}" im Link ist ungültig`,
    });
  }

  const adminInvitation = await getAdminInvitation(inviteId);
  console.log(">>>>>> invitation = ", adminInvitation);
  if (!adminInvitation) {
    throw new Response("Einladung nicht gefunden", {
      status: 404,
      statusText: `Die Einladung "${inviteId}" ist ungültig`,
    });
  }

  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  if (!token) {
    throw new Response("Ungültiges Token", { status: 400, statusText: `Ungültiges Token: "${token}"` });
  }

  const adminToken = (await decryptEncryptedAdminToken(token)).payload as AdminToken;
  if (adminToken.email !== adminInvitation.email) {
    throw new Response("Das Token ist ungültig", { status: 400, statusText: "Das Token ist ungültig" });
  }
  const validUntil = DateTime.fromISO(adminToken.expires_at);
  if (validUntil.endOf("day") < DateTime.now()) {
    throw new Response("Das Token ist abgelaufen", { status: 400, statusText: "Das Token ist abgelaufen" });
  }

  return json({ adminInvitation: adminInvitation });
};

const InviteResponseView = () => {
  const navigate = useNavigate();
  const errors = useActionData<typeof action>();
  // @ts-ignore
  const { adminInvitation } = useLoaderData() as LoaderData;
  const validUntil = DateTime.fromJSDate(new Date(adminInvitation.expires_at));
  return (
    <>
      <header>
        <PageHeader title={messages.adminInviteUserResponseForm.title} />
      </header>
      <Form method={"post"} className="md:w-1/2">
        <main className={"flex flex-col gap-4"}>
          <InputWithLabel label={messages.adminInviteUserResponseForm.email} type="email" name={"email"} id={"email"} disabled={true} defaultValue={adminInvitation.email || ""} />
          <InputWithLabel
            label={messages.adminInviteUserResponseForm.validUntil}
            type="text"
            name={"validUntil"}
            id={"validUntil"}
            disabled={true}
            defaultValue={dateUtils.dateToFormat({ value: validUntil })}
          />
          <InputWithLabel
            label={messages.adminInviteUserResponseForm.name}
            type="text"
            name={"adminName"}
            id={"adminName"}
            defaultValue={adminInvitation.name}
            error={errors?.adminName}
          />
          <InputWithLabel label={messages.adminInviteUserResponseForm.password} type="password" name={"password"} id={"password"} error={errors?.password} />
          <InputWithLabel
            label={messages.adminInviteUserResponseForm.passwordRepeat}
            type="password"
            name={"passwordRepeat"}
            id={"passwordRepeat"}
            error={errors?.passwordRepeat}
          />
          <ButtonContainer>
            <RedButton>
              <button onClick={() => navigate(routeLinks.games)}>{messages.appmenu.games}</button>
            </RedButton>
            <DefaultButton className="ml-auto">
              <button type={"submit"}>{messages.buttons.save}</button>
            </DefaultButton>
          </ButtonContainer>
        </main>
      </Form>
    </>
  );
};

export const CatchBoundary = () => {
  const caught = useCatch();
  if (caught.status === 400 || caught.status === 404) {
    return <div className="error-container">{`Huh? What the heck are u doing: ${caught.statusText}`}</div>;
  }
  throw new Error(`Unhandled error: ${caught.status}`);
};

export const ErrorBoundary = ({ error }: { error: Error }) => {
  return (
    <>
      <section>
        <h5 className={"font-default-bold text-display-small tracking-tighter text-black"}>{`Die Einladung kann nicht bearbeitet werden.`}</h5>
      </section>
      <section>{`${error.message}`}</section>
    </>
  );
};

export default InviteResponseView;
