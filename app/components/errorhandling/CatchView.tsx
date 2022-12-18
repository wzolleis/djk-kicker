import type {ThrownResponse} from "@remix-run/react/dist/errors";
import DefaultButton from "../common/buttons/DefaultButton";
import messages from "~/components/i18n/messages";
import React from "react";
import routeLinks from "~/helpers/constants/routeLinks";
import {useNavigate} from "@remix-run/react";

export type CatchViewProps = {
  status: number;
  statusText: string | null;
  description: string;
  caught: ThrownResponse | null;
};

const CatchView = ({ status, statusText, description, caught }: CatchViewProps) => {
  const navigate = useNavigate();
  return (
    <div>
      <h1>Fehler: {description}</h1>
      <p>Status: {status}</p>
      <p>Grund: {statusText || "Keine Ahnung, was das Problem ist"}</p>
      {caught && (
        <pre>
          <code>{JSON.stringify(caught.data, null, 2)}</code>
        </pre>
      )}
      <DefaultButton className={"m-5 flex justify-start"}>
        <button onClick={() => navigate(routeLinks.games)}>{messages.appmenu.games}</button>
      </DefaultButton>
    </div>
  );
};

export default CatchView;
