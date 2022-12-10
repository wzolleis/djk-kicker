import {HTMLInputTypeAttribute} from "react";

type InputProps = {
    id: string,
    type: HTMLInputTypeAttribute | undefined,
    name: string,
    defaultValue?: string,
    label: string

    required?: boolean | undefined
}

const InputWithLabel = (props: InputProps) => {
    const {id, name, label, type, defaultValue} = props
    return (
        <div className={"flex flex-col gap-2 w-full"}>
            <label className={"text-gray-600 font-default-medium"} htmlFor={name}>{label}</label>
            <input
                className={"font-default-semibold rounded-xl p-3 bg-gray-50 ring ring-1 border-none outline-none ring-indigo-100"}
                type={type} defaultValue={defaultValue} id={id} name={name}/>
        </div>
    )
}

export default InputWithLabel;