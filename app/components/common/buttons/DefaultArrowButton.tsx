import {Link} from "@remix-run/react";

const DefaultArrowButton = ({url}: { url: string }) => {

    return (
        <Link
            className={"flex items-center justify-end"}
            to={url}
        >
            <div className={"rounded-full p-3 ring ring-1 ring-indigo-100"}>
                <img
                    src="/img/arrow-indigo.png"
                    className={"h-4 w-4 rounded-full "}
                    alt=""
                />
            </div>
        </Link>
    )


};

export default DefaultArrowButton
