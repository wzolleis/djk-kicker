import {NavLink, useFetcher, useNavigate} from "@remix-run/react";
import routeLinks from "~/helpers/constants/routeLinks";
import classNames from "classnames";
import {useEffect} from "react";
import {User} from "@prisma/client";
import is from "@sindresorhus/is";
import {NavbarLoaderData} from "~/routes/application/navbar";
import undefined = is.undefined;

const AdminNavButton = ({
                            to,
                            label,
                            className,
                            optionalUser
                        }: { to: string, label: string, className: string, optionalUser: User | undefined }) => {
    if (!optionalUser) return null
    return (
        <NavLink to={to}
                 className="w-full focus:text-teal-500 hover:text-teal-500 justify-center inline-block text-center pt-2 pb-1">
            <p className={classNames(className, "flex h-10 w-10 items-center text-black justify-center rounded-full bg-white p-3 font-default-semibold transition ease-in-out hover:scale-90")}/>
            <span className="tab tab-account block text-white text-xs md:text-body-medium">{label}</span>
        </NavLink>
    )

}
const NavButton = ({to, label, className}: { to: string, label: string, className: string }) => {
    return (
        <NavLink to={to}
                 className="w-full focus:text-teal-500 hover:text-teal-500 justify-center inline-block text-center pt-2 pb-1">
            <p className={classNames(className, "flex h-10 w-10 items-center text-black justify-center rounded-full bg-white p-3 font-default-semibold transition ease-in-out hover:scale-90")}/>
            <span className="tab tab-account block text-white text-xs md:text-body-medium">{label}</span>
        </NavLink>
    )
}


const BottomNavigationBar = ({admin}: { admin: User | undefined }) => {
    const fetcher = useFetcher<NavbarLoaderData>();
    const navigate = useNavigate()

    useEffect(() => {
        fetcher.load('/application/navbar');
        if (fetcher.type === "init") {
            fetcher.load('/application/navbar');
        }
    }, []);

    const isAuthenticated = fetcher.data?.isAuthenticated
    const nextGame = fetcher.data?.nextGame

    if (!isAuthenticated) {
        return (
            <div className="w-full">
                <section id="bottom-navigation"
                         className="block fixed inset-x-0 bottom-0 z-10 scroll:z-0 bg-black shadow">
                    <div id="tabs" className="flex justify-start">
                        <NavButton to={routeLinks.dashboard} label={"Registrieren"}
                                   className={"fa-solid fa-user-plus"}/>
                    </div>
                </section>
            </div>
        )
    }

    const gameId = nextGame?.id

    return (
        <div className="w-full h-screen">
            <section id="bottom-navigation" className="block fixed inset-x-0 bottom-0 z-10 bg-black shadow">
                <div id="tabs" className="flex justify-start">
                    <NavButton to={routeLinks.dashboard} label={"Home"} className={"fa-solid fa-home"}/>
                    {gameId && <NavButton to={routeLinks.game(gameId)} label={"Spiel"}
                                          className={"fa-solid fa-futbol"}/>
                    }
                    <NavButton to={routeLinks.dashboard} label={"Profil"} className={"fa-solid fa-user-large"}/>
                    <AdminNavButton to={routeLinks.admin.adminLandingPage} label={"Verwaltung"}
                                    className={"fa-solid fa-gears"} optionalUser={admin}/>
                </div>
            </section>
        </div>
    )
}

export default BottomNavigationBar