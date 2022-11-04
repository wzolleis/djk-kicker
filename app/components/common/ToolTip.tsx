type ToolTipProps = {

    text: string
}

const ToolTip = ({text}: ToolTipProps) => {

    return (
        <section className={`rounded-lg bg-indigo-200/50 border border-indigo-500 px-3 py-2 flex items-center gap-2`}>
            <img src="/img/info.png" alt="" className={"h-6 w-6"}/>
            <p className={`text-indigo-500 font-poppins-regular text-label-small`}>{text}</p>
        </section>



    )


}


export default ToolTip;