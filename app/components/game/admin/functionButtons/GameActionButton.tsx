import classNames from "classnames";

export type GameActionButtonProps = {
    intent: string
    label: string
    icon: string
}

const GameActionButton = ({intent, label, icon}: GameActionButtonProps) => {
    return (
        <button
            type={'submit'}
            name={'intent'} value={intent}
            className="text-slate-800 hover:text-blue-600 text-sm bg-white hover:bg-slate-100 border border-slate-200 rounded-r-lg font-small md:font-medium px-4 py-2 inline-flex space-x-1 items-center"
        >
            <i className={classNames(icon, "fa mx-1")}/>
            <span className={"hidden lg:inline"}>{label}</span>
        </button>
    )
}

export default GameActionButton