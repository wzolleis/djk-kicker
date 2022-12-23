import {Link} from "@remix-run/react";

export type ButtonProps = {
    title: string,
    link: string
}

const SmallButton = ({title, link}: ButtonProps) => {
    return (
        <Link to={link}
              className={"font-default-regular text-label-medium  rounded-lg text-white py-3 px-3 bg-indigo-600 ring ring-1 ring-indigo-600"}>{title}</Link>

    )
}

export default SmallButton;