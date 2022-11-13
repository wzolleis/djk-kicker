import { Outlet } from "@remix-run/react";
import AppNavBar from "~/components/nav/AppNavBar";
import { appMenu } from "~/components/nav/appMenu";
import { useOptionalUser } from "~/utils";
import { Toaster } from "react-hot-toast";

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
    )
}

export default Application