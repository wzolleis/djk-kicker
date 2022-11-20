import {useState} from "react";
import {Form, Link} from "@remix-run/react";
import {closeIcon, hamburgerIcon} from "~/components/nav/menuIcons";
import type {MenuEntry} from "~/components/nav/appMenu";
import type {User} from "@prisma/client";
import messages from "~/components/i18n/messages";
import {useOptionalUser} from "~/utils";

interface AppNavBarProps {
    appMenu: MenuEntry[];
    user: User | undefined;
}

const AppNavBar = ({appMenu, user}: AppNavBarProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuItemClassName = isOpen ? "block" : "hidden";
    const hamburgerOrCloseIcon = isOpen ? hamburgerIcon : closeIcon;
    const isLoggedIn: boolean = !!useOptionalUser()

    return (
        <header className="bg-slate-800 sm:flex sm:justify-between sm:items-center sm:px-4 sm:py-3 text-white">
            <div className="flex items-center justify-between px-4 py-3 sm:p-0">
                <div className="flex items-center justify-between">
                    <img src="/img/logo.png" alt="" className={"h-10"}/>
                    <span className="px-2 text-4xl font-poppins-semibold">{messages.app.title}</span>
                </div>
                <div className="sm:hidden">
                    <button type="button"
                            className="block hover:text-white focus:text-white focus:outline-none"
                            onClick={() => setIsOpen(!isOpen)}
                    >
                        <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d={hamburgerOrCloseIcon}/>
                        </svg>
                    </button>
                </div>
            </div>
            <nav className={`${menuItemClassName} px-2 pt-2 pb-4 sm:flex sm:p-0`}>
                {appMenu.map((menu) =>
                    <Link key={menu.id}
                          className=" px-2 py-1 font-semibold rounded hover:bg-gray-800 hover:text-yellow-300"
                          to={menu.appLink.path}
                          hidden={menu.appLink.admin && !isLoggedIn}>
                        {menu.appLink.label}
                    </Link>
                )}
                <Form action="/logout" method="post" hidden={!isLoggedIn}>
                    <button
                        type="submit"
                        className="block px-2 py-1 font-semibold rounded hover:bg-gray-800 hover:text-yellow-300"
                    >
                        { messages.appmenu.logout}
                    </button>
                </Form>
                <Form action="/login" method="get" hidden={isLoggedIn}>
                    <button
                        type="submit"
                        className="block px-2 py-1 font-semibold rounded hover:bg-gray-800 hover:text-yellow-300"
                    >
                        {messages.appmenu.login}
                    </button>
                </Form>

            </nav>

        </header>
    );
}

export default AppNavBar