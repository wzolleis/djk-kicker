import { useOptionalUser } from "~/utils";
import AppNavBar from "~/components/nav/AppNavBar";
import { appMenu } from "~/components/nav/appMenu";
import { Outlet } from "@remix-run/react";

const Games = () => {
  const user = useOptionalUser();

  return (
    <div className="flex h-full min-h-screen flex-col bg-white">
      <AppNavBar appMenu={appMenu.app} user={user} />
      <main className="flex w-full">
        <div className="flex-1 py-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default Games