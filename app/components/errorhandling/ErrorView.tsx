import * as React from "react";
import ButtonContainer from "~/components/common/container/ButtonContainer";
import DefaultButton from "~/components/common/buttons/DefaultButton";
import routeLinks from "~/helpers/constants/routeLinks";
import messages from "~/components/i18n/messages";
import {useNavigate} from "@remix-run/react";

export type ErrorViewProps = {
  error: Error;
};

const ErrorView = ({ error }: ErrorViewProps) => {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Error</h1>
      <p>{error.message}</p>
      <p>The stack trace is:</p>
      <pre>{error.stack}</pre>
      <ButtonContainer>
        <DefaultButton className={"m-5 flex justify-start"}>
          <button onClick={() => navigate(routeLinks.dashboard)}>{messages.appmenu.games}</button>
        </DefaultButton>
      </ButtonContainer>
    </div>
  );
};

export default ErrorView;
