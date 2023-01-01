import {NavLink, useFetcher, useLocation} from "@remix-run/react";
import routeLinks from "~/helpers/constants/routeLinks";
import classNames from "classnames";
import {useEffect} from "react";
import {User} from "@prisma/client";
import is from "@sindresorhus/is";
import {NavbarLoaderData} from "~/routes/application/navbar";
import messages from "~/components/i18n/messages";
import fetchLinks from "~/helpers/constants/fetchLinks";
import undefined = is.undefined;


const NavButton = ({
                       to,
                       label,
                       className,
                       active
                   }: { to: string, label: string, className: string, active: boolean }) => {
    return (
        <NavLink to={to}
                 className="w-full focus:text-teal-500 hover:text-teal-500 justify-center inline-block text-center pt-2 pb-1">
            <p className={classNames(className, `${active ? "bg-yellow-400" : "bg-white"}`, "flex h-10 w-10 items-center text-black justify-center rounded-full p-3 font-default-semibold transition ease-in-out hover:scale-90")}/>
            <span
                className={classNames(`${active ? "text-yellow-400" : "text-white"}`, `tab tab-account block text-xs md:text-body-medium`)}>{label}</span>
        </NavLink>
    )
}

const AdminNavButton = ({
                            to,
                            label,
                            className,
                            optionalUser
                        }: { to: string, label: string, className: string, optionalUser: User | undefined }) => {
    if (!optionalUser) return null

    const location = useLocation()
    const active = location.pathname.includes("admin")

    return <NavButton to={to}
                      label={label}
                      className={className}
                      active={active}
    />
}

const PlayerRegistrationButton = ({
                                      gameId
                                  }: { isAuthenticated: boolean, gameId: string | undefined }) => {
    const link = gameId ? routeLinks.player.createForGame(gameId) : routeLinks.player.create
    const location = useLocation()
    const active = location.pathname.includes(routeLinks.player.create)

    return <NavButton to={link}
                      label={messages.bottomNavBar.registerPlayer}
                      className={"fa-solid fa-user-plus"}
                      active={active}
    />
}

const GameButton = ({gameId}: { gameId: string | undefined }) => {
    if (!gameId) return null
    const location = useLocation()
    const active = location.pathname === routeLinks.game(gameId)
    return (
        <NavButton to={routeLinks.game(gameId)}
                   label={messages.bottomNavBar.game}
                   className={"fa-solid fa-futbol"}
                   active={active}/>
    )
}
const ProfileButton = ({playerId}: { playerId: string | undefined }) => {
    if (!playerId) return null
    const location = useLocation()
    const active = location.pathname === routeLinks.player.profile

    return (
        <NavButton to={routeLinks.player.profile} label={messages.bottomNavBar.profile}
                   className={"fa-solid fa-user-large"}
                   active={active}
        />
    )
}

const HomeButton = ({playerId}: { playerId: string | undefined }) => {
    if (!playerId) return null

    const location = useLocation()
    const active = location.pathname === routeLinks.dashboard

    return (
        <NavButton to={routeLinks.dashboard} label={messages.bottomNavBar.home} className={`fa-solid fa-home`}
                   active={active}/>
    )
}

const BottomNavigationBar = ({admin}: { admin: User | undefined }) => {
    const fetcher = useFetcher<NavbarLoaderData>();

    useEffect(() => {
        fetcher.load(fetchLinks.navbar);
    }, []);

    const isAuthenticated = !!fetcher.data?.isAuthenticated
    const gameId = fetcher.data?.nextGame?.id
    const playerId = fetcher.data?.player?.id
    return (
        <div className="w-full">
            <section id="bottom-navigation" className="block fixed inset-x-0 bottom-0 z-10 bg-black shadow">
                <div id="tabs" className="flex justify-start">
                    <HomeButton playerId={playerId}/>
                    <GameButton gameId={gameId}/>
                    <ProfileButton playerId={playerId}/>
                    <AdminNavButton to={routeLinks.admin.adminLandingPage}
                                    label={messages.bottomNavBar.administration}
                                    className={"fa-solid fa-gears"}
                                    optionalUser={admin}
                    />
                    <PlayerRegistrationButton isAuthenticated={isAuthenticated} gameId={gameId}/>
                </div>
            </section>
        </div>
    )
}

export default BottomNavigationBar