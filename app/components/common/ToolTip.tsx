type ToolTipProps = {

    text: string
}

const ToolTip = ({text}: ToolTipProps) => {

    return (
        <section className={`rounded-xl bg-indigo-100 py-3 px-3  ring ring-1 ring-indigo-200 flex items-center gap-2 shadow-lg shadow-indigo-500/20`}>
            <p className={`text-indigo-500 font-poppins-regular text-label-small`}>{text}</p>
        </section>



    )


}


export default ToolTip;