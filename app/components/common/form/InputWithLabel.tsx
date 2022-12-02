type InputProps = {
    id: string,
    type: string,
    name: string,
    defaultValue?: string,
    label: string
}


const InputWithLabel = ({id, name, label, type, defaultValue}: InputProps) => {

    return (
        <div className={"flex flex-col gap-2 w-full"}>
            <label className={"text-label-medium font-poppins-medium"} htmlFor={name}>{label}</label>
            <input
                className={"font-poppins-semibold rounded-xl p-3 bg-gray-50 ring ring-1 border-none outline-none ring-indigo-100"}
                type={type} defaultValue={defaultValue} id={id} name={name}/>
        </div>
    )
}

export default InputWithLabel;