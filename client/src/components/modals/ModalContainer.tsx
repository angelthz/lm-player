import { useModalRoot } from "src/hooks/useModal";
import { createPortal } from "react-dom";
import { XIcon } from "lucide-react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    className?: string;
}

export default function ModalContainer({ isOpen, onClose, className, children }: ModalProps) {
    const modalRoot = useModalRoot('modal-root') as HTMLElement;

    if (!isOpen || !modalRoot) return null;

    return createPortal(
        <div id="modal-container" className="modal-overlay fixed top-0 left-0 bottom-0 right-0 bg-black/80 flex justify-center items-center z-50" onClick={onClose}>
            <div id="modal-content" className={`
                w-[640px] h-[540px]
                px-6 py-8 rounded-md
                bg-zinc-900 
                relative
                flex flex-col
                 
            `} onClick={(e) => e.stopPropagation()}
            >
                <header className="w-full h-[22px] flex justify-end">
                    <button
                        className="group cursor-pointer"
                        onClick={onClose}
                        aria-label="Close modal"
                    >
                        <XIcon className="w-[20px] h-[20px] group-hover:stroke-zinc-400"></XIcon>
                    </button>
                </header>
                {children}
            </div>
        </div>,
        modalRoot,
    )

}