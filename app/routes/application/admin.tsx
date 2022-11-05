import { Outlet } from "@remix-run/react";
import messages from "~/components/i18n/messages";

const Admin = () => {
  return (
    <>
      <h1 className="">{messages.adminLandingPage.title}</h1>
      <Outlet />
    </>
  );
};

export default Admin;