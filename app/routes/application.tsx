import {Outlet, useCatch, useNavigate} from "@remix-run/react";
import TopNavBar from "~/components/nav/TopNavBar";
import {appMenu} from "~/components/nav/appMenu";
import {useOptionalUser} from "~/utils";
import {Toaster} from "react-hot-toast";
import DefaultButton from "~/components/common/buttons/DefaultButton";
import routeLinks from "~/helpers/constants/routeLinks";
import messages from "~/components/i18n/messages";
import React from "react";
import PageHeader from "~/components/common/PageHeader";
import ErrorComponent from "~/components/common/error/ErrorComponent";
import BottomNavigationBar from "~/components/nav/BottomNavigationBar";

const Application = () => {
    const user = useOptionalUser();
    return (
        <div className="flex h-full min-h-screen flex-col">
            <TopNavBar appMenu={appMenu.app} user={user}/>
            <div>
                <main className="flex h-full">
                    <div className="flex-1 p-4 px-4 lg:px-10">
                        <Toaster/>
                        <div className={"mb-20 md:mb-5"}>
                            <Outlet/>
                        </div>
                        <BottomNavigationBar admin={user}/>
                    </div>
                </main>
            </div>
        </div>
    );
};

export const CatchBoundary = () => {
    const navigate = useNavigate();
    const caught = useCatch();
    return (
        <div>
            <PageHeader title={`Es ist ein Fehler aufgetreten: ${caught.statusText}`}/>
            <DefaultButton className={"m-5 flex justify-start"}>
                <button onClick={() => navigate(routeLinks.dashboard)}>{messages.appmenu.dashboard}</button>
            </DefaultButton>
        </div>
    );
};

export const ErrorBoundary = () => {
    return <ErrorComponent/>;
};

export default Application;
