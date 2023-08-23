import type {PropsWithChildren} from "react";
import {useEffect} from "react";

export type ModalProps = {
    title: string,
    show: boolean,
    onClose: () => void,
}


const Modal = ({children, title, show, onClose}: PropsWithChildren<ModalProps>) => {
    useEffect(() => {
        if (show) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [show]);

    if (show) {
        return (
            <main
                onClick={onClose}
                className="bg-black bg-opacity-30 p-3 fixed lg:px-60 left-0 top-0 right-0 bottom-0 flex flex-col items-center justify-center"
            >
                <div
                    onClick={(e) => e.stopPropagation()}
                    className="rounded-xl flex flex-col bg-white ring-1 ring-indigo-100 p-5 md:px-10 md:py-5 w-full md:w-9/12 overflow-y-scroll"
                >
                    <div className="flex justify-between items-center">
                        <p className="text-headline-medium font-default-bold">{title}</p>
                    </div>
                    <div>{children}</div>
                </div>
            </main>
        );
    } else return null;
};
export default Modal;