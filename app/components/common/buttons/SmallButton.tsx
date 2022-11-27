import {Link} from "@remix-run/react";

export type ButtonProps = {
    title: string,
    link: string
}

const SmallButton = ({title, link}: ButtonProps) => {
    return (
        <Link to={link}
              className={"font-poppins-regular text-label-medium text-indigo-600 rounded-lg py-3 px-3 bg-indigo-100 ring ring-1 ring-indigo-600"}>{title}</Link>

    )
}

export default SmallButton;