type TagProps = {
    text: string;
}

const SmallTag = ({text}: TagProps) => {
    return (
        <div className={"px-4 py-2 rounded-xl ring ring-1 ring-indigo-100 bg-white shadow-lg shadow-indigo-500/20"}>
            <p className={"font-poppins-regular text-label-medium text-slate-900"}>{text}</p>
        </div>
    )
}

export default SmallTag;