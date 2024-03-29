import React, {useState} from "react";
import {Form, Link} from "@remix-run/react";
import {closeIcon, hamburgerIcon} from "~/components/nav/menuIcons";
import type {MenuEntry} from "~/components/nav/appMenu";
import type {User} from "@prisma/client";
import {Player} from "@prisma/client";
import messages from "~/components/i18n/messages";
import {useOptionalPlayers, useOptionalUser} from "~/utils";
import Greeting from "~/components/nav/Greeting";

interface AppNavBarProps {
    appMenu: MenuEntry[];
    user: User | undefined | null;

    player: Player | null

}

const TopNavBar = ({appMenu, player}: AppNavBarProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const user: User | undefined = useOptionalUser()
    const isLoggedIn: boolean = !!user
    const menuItemClassName = isOpen ? "block" : "hidden";
    const hamburgerOrCloseIcon = isOpen ? hamburgerIcon : closeIcon;
    useOptionalPlayers()

    return (
        <header className="bg-black text-white sm:flex sm:items-center sm:justify-between sm:px-4 sm:py-3">
            <div className="flex items-center justify-between px-4 py-3 sm:p-0">
                <div className={'flex flex-col gap-5'}>
                    <Link to={"/application/dashboard"}>
                        <div className="flex items-center justify-between">
                            <img src="/img/logo.png" alt="" className={"h-10"}/>
                            <span className="px-2 font-default-semibold text-4xl">{messages.app.title}</span>
                        </div>
                    </Link>
                    <Greeting
                        player={player}
                        showGreeting={true}
                    />
                </div>
                <div className="sm:hidden">
                    <button type="button" className="block hover:text-white focus:text-white focus:outline-none"
                            onClick={() => setIsOpen(!isOpen)}>
                        <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d={hamburgerOrCloseIcon}/>
                        </svg>
                    </button>
                </div>
            </div>
            <nav className={`${menuItemClassName} px-2 pt-2 pb-4 sm:flex sm:p-0`}>
                {appMenu.map((menu) => (
                    <Link
                        key={menu.id}
                        className=" rounded px-2 py-1 font-semibold hover:bg-gray-800 hover:text-yellow-300"
                        to={menu.appLink.path}
                        hidden={menu.appLink.requiresAdmin && !isLoggedIn}>
                        {menu.appLink.label}
                    </Link>
                ))}
                <Form action="/ChangePassword" method="get" hidden={!isLoggedIn}>
                    <button type="submit"
                            className="block rounded px-2 py-1 font-semibold hover:bg-gray-800 hover:text-yellow-300">
                        {messages.appmenu.changePassword}
                    </button>
                </Form>
                <Form action="/logout" method="post" hidden={!isLoggedIn}>
                    <button type="submit"
                            className="block rounded px-2 py-1 font-semibold hover:bg-gray-800 hover:text-yellow-300">
                        {messages.appmenu.logout}
                    </button>
                </Form>
                <Form action="/login" method="get" hidden={isLoggedIn}>
                    <button type="submit"
                            className="block rounded px-2 py-1 font-semibold hover:bg-gray-800 hover:text-yellow-300">
                        {messages.appmenu.login}
                    </button>
                </Form>
                <Form action="/ResetPassword" method="get" hidden={isLoggedIn}>
                    <button type="submit"
                            className="block rounded px-2 py-1 font-semibold hover:bg-gray-800 hover:text-yellow-300">
                        {messages.appmenu.resetPassword}
                    </button>
                </Form>
                <Form action="/application/player/rescue" method="get">
                    <button type="submit"
                            className="block rounded px-2 py-1 font-semibold hover:bg-gray-800 hover:text-yellow-300">
                        {messages.appmenu.rescue}
                    </button>
                </Form>
            </nav>
        </header>
    );
};

export default TopNavBar;
