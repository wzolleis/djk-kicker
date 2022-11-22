import { Outlet } from "@remix-run/react";
import messages from "~/components/i18n/messages";

const Admin = () => {
  return (
    <>
      <Outlet />
    </>
  );
};

export default Admin;