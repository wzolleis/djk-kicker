import {ReactNode} from "react";

type InputProps = {
    id: string,
    name: string,
    defaultValue?: string,
    label: string,
    children: ReactNode
}


const SelectWithLabel = ({id, name, label, defaultValue, children}: InputProps) => {

    return (
        <div className={"flex flex-col gap-2 w-full"}>
            <label className={"text-gray-600 font-default-medium"} htmlFor={name}>{label}</label>
            <select
                className={"font-default-semibold rounded-xl p-3 bg-gray-50 ring ring-1 border-none outline-none ring-indigo-100"}
                defaultValue={defaultValue} id={id} name={name}>
                {children}
            </select>
        </div>
    )
}

export default SelectWithLabel;