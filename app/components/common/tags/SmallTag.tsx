type TagProps = {
    text: string;
}

const SmallTag = ({text}: TagProps) => {
    return (
        <div className={"px-3 py-1.5 rounded-full bg-neutral-200 "}>
            <p className={"font-default-regular text-label-medium text-black"}>{text}</p>
        </div>
    )
}

export default SmallTag;