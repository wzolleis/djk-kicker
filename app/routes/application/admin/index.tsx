import { Link, useNavigate } from "@remix-run/react";
import messages from "~/components/i18n/messages";

const GamesSvg = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24"
         stroke="currentColor" strokeWidth="1.5"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
};

const UsersSvg = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24"
         stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round"
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
};

const AdminIndex = () => {
  // Beispiel aus https://tailwindcomponents.com/component/cards-9
  const navigate = useNavigate();

  return (
    <div className="px-3 md:lg:xl:px-40 border-t border-b py-20 bg-opacity-10">
      <div className="grid grid-cols-1 md:grid-cols-2 group bg-white shadow-xl shadow-neutral-100 border ">
        <div
          className="p-10 flex flex-col items-center text-center group md:lg:xl:border-r md:lg:xl:border-b hover:bg-slate-50 cursor-pointer"
          onClick={() => navigate("games")}
        >
          <span className="p-5 rounded-full bg-orange-500 text-white shadow-lg shadow-orange-200">
            <GamesSvg />
          </span>
          <Link className="text-xl font-medium text-slate-700 mt-3" to="games">{messages.adminLandingPage.games}</Link>
          <p className="mt-2 text-sm text-slate-500">{messages.adminLandingPage.gamesDescription}</p>
        </div>
        <div
          className="p-10 flex flex-col items-center text-center group md:lg:xl:border-r md:lg:xl:border-b hover:bg-slate-50 cursor-pointer"
          onClick={() => navigate("users")}
        >
          <span className="p-5 rounded-full bg-orange-500 text-white shadow-lg shadow-orange-200">
            <UsersSvg />
          </span>
          <p className="text-xl font-medium text-slate-700 mt-3">
            <Link to="users">{messages.adminLandingPage.users}</Link>
          </p>
          <p className="mt-2 text-sm text-slate-500">{messages.adminLandingPage.usersDescription}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminIndex;