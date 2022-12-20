import { useEffect, useState } from "react";
import type { LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Outlet, useNavigate } from "@remix-run/react";

import TabContainer from "~/components/common/tabs/TabContainer";
import Tab from "~/components/common/tabs/Tab";
import { configuration } from "~/config";

export const loader: LoaderFunction = async ({ request }) => {
  if (!Object.keys(configuration.url.editGameForm.values).includes(request.url.split("/").pop()!)) {
    return redirect("/application/admin/games");
  }
  return json({ hello: "hello" });
};

const EditGame = () => {
  const [currentUrl, setCurrentUrl] = useState("");
  useEffect(() => {
    const lastUrlElement: string = window.location.pathname.split("/").pop()!;
    setCurrentUrl(lastUrlElement);
  });
  return (
    <div className={"flex flex-col gap-3"}>
      <TabContainer>
        <Tab
          url={configuration.url.editGameForm.values.edit}
          title={configuration.url.editGameForm.translations.edit}
          isActive={currentUrl === configuration.url.editGameForm.values.edit}>
          <img className={"h-6"} src="/img/icons/pencil-line.png" alt="" />
        </Tab>
        <Tab
          url={configuration.url.editGameForm.values.status}
          title={configuration.url.editGameForm.translations.status}
          isActive={currentUrl === configuration.url.editGameForm.values.status}>
          <img className={"h-6"} src="/img/icons/status.png" alt="" />
        </Tab>
        <Tab
          url={configuration.url.editGameForm.values.invite}
          title={configuration.url.editGameForm.translations.invite}
          isActive={currentUrl == configuration.url.editGameForm.values.invite}>
          <img className={"h-6"} src="/img/icons/mail.png" alt="" />
        </Tab>
        <Tab
          url={configuration.url.editGameForm.values.actions}
          title={configuration.url.editGameForm.translations.actions}
          isActive={currentUrl == configuration.url.editGameForm.values.actions}>
          <img className={"h-6"} src="/img/icons/history.png" alt="" />
        </Tab>
      </TabContainer>
      <Outlet></Outlet>
    </div>
  );
};

export default EditGame;
