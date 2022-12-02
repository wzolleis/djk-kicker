import type {ReactNode} from "react";

export type ModalProps = {
    children: ReactNode,
    title: string,
    show: boolean,
    onClose: any,
}


const Modal = ({children, title, show, onClose}: ModalProps) => {

    if (show) {
        return (
            <main onClick={onClose}
                  className={"bg-black bg-opacity-30 p-3 fixed lg:px-60 left-0 top-0 right-0 bottom-0 flex flex-col items-center justify-center"}>
                <div onClick={(e) => e.stopPropagation()}

                     className={"rounded-xl bg-white ring ring-1 ring-indigo-100 p-5 md:p-10 w-full md:w-9/12"}>
                    <div className={"flex justify-between items-center"}>
                        <p className={"text-headline-medium font-poppins-semibold "}>{title}</p>
                        <div className={"rounded bg-red-600 text-white p-3"} onClick={onClose}>Schließen</div>
                    </div>
                    <div>
                        {children}
                    </div>
                </div>
            </main>


        )
    } else return null;
}
export default Modal;