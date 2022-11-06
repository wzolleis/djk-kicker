import {Link} from "@remix-run/react";

export type ButtonProps = {
    title: string,
    link: string
}

const SmallButton = ({title, link}: ButtonProps) => {
    return (
        <Link to={link}
              className={"font-poppins-regular text-label-medium text-white rounded-lg py-3 px-5 bg-indigo-500 "}>{title}</Link>

    )
}

export default SmallButton;