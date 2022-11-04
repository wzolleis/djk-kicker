import {Outlet} from "@remix-run/react";

const Games = () => {


    return (
        <div className="h-full min-h-screen">
            <Outlet></Outlet>
        </div>
    )
}

export default Games