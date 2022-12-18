import {Outlet, useCatch, useNavigate} from "@remix-run/react";
import AppNavBar from "~/components/nav/AppNavBar";
import {appMenu} from "~/components/nav/appMenu";
import {useOptionalUser} from "~/utils";
import {Toaster} from "react-hot-toast";
import DefaultButton from "~/components/common/buttons/DefaultButton";
import routeLinks from "~/helpers/constants/routeLinks";
import messages from "~/components/i18n/messages";
import React from "react";
import PageHeader from "~/components/common/PageHeader";

const Application = () => {
  const user = useOptionalUser();

  return (
    <div className="flex h-full min-h-screen flex-col">
      <AppNavBar appMenu={appMenu.app} user={user} />
      <main className="flex h-full">
        <div className="flex-1 p-4 px-4 lg:px-10">
          <Toaster />
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export const CatchBoundary = () => {
  const navigate = useNavigate();
  const caught = useCatch();
  return (
    <div>
      <PageHeader title={`Es ist ein Fehler aufgetreten: ${caught.statusText}`} />
        <DefaultButton className={"m-5 flex justify-start"}>
            <button onClick={() => navigate(routeLinks.games)}>{messages.appmenu.games}</button>
        </DefaultButton>
    </div>
  );
};

export const ErrorBoundary = () => {
  const navigate = useNavigate();
  const title = `Ein technisches Problem ist aufgetreten. Bitte melde dich bei einem Administrator und versuche es später nochmal`;
  return (
    <div>
      <h2 className={"m-5 font-default-bold text-display-small tracking-tighter text-black"}>{title}</h2>
      <DefaultButton className={"m-5 flex justify-start"}>
        <button onClick={() => navigate(routeLinks.games)}>{messages.appmenu.games}</button>
      </DefaultButton>
    </div>
  );
};

export default Application;
