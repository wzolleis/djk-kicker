type TagProps = {
    text: string,
    isDisabled?: boolean
}

const SmallTag = ({text, isDisabled}: TagProps) => {
    return (
        <div className={`px-3 py-1.5 rounded-full ${isDisabled ? ' bg-neutral-200' : ' bg-neutral-200'}`}>
            <p className={`font-default-regular text-label-medium  ${isDisabled ? 'text-gray-400' : 'text-black'}`}>{text}</p>
        </div>
    )
}

export default SmallTag;