import { XMark } from "nui-react-icons";
import React, { useRef } from "react";
import { useOverlay, usePreventScroll, OverlayContainer, type OverlayProps } from "@react-aria/overlays";

import { BackButton } from "@/components/back";
import { cn } from "@/utils/utils";

interface ModalProps extends OverlayProps {
    title?: string;
    children: React.ReactNode;
    isOpen: boolean;
    hasX?: boolean;
    size?: "sm" | "md" | "lg";
    onClose?: () => void;
}

const Modal: React.FC<ModalProps> = ({ title, children, onClose, isOpen, size = "sm", hasX = true }) => {
    const ref = useRef<HTMLDivElement>(null);

    usePreventScroll();
    // Setup the modal with useOverlay for accessibility
    const { overlayProps } = useOverlay(
        {
            isOpen,
            onClose,
            isDismissable: true, // This allows dismissing by clicking outside or pressing Escape
        },
        ref
    );

    return (
        <OverlayContainer>
            <div
                className="group fixed inset-0 flex items-center justify-center z-40 backdrop-blur-xs bg-white/40"
                data-has-x={hasX ? "true" : "false"}
            >
                <div
                    data-has-x={hasX ? "true" : "false"}
                    {...overlayProps}
                    ref={ref}
                    className={cn("bg-zinc-800 rounded-lg w-full h-full md:h-auto relative z-50 shadow-2xl", {
                        "max-w-lg": size == "sm",
                        "max-w-2xl": size == "md",
                        "max-w-5xl": size == "lg",
                    })}
                >
                    <div className="sticky top-0 md:hidden p-4 flex items-center gap-4 bg-background z-20 shadow-2xl">
                        <BackButton onClick={onClose} />
                        <div>{title && <h2 className="text-lg font-semibold">{title}</h2>}</div>
                    </div>
                    {/* {title && <h2 className="text-lg font-semibold mb-4">{title}</h2>} */}
                    <button aria-label="cancel" className="absolute top-6 right-6 hidden group-data-[has-x=true]:block" onClick={onClose}>
                        <XMark size={20} />
                    </button>
                    <div className="py-4 md:px-4">{children}</div>
                </div>
            </div>
        </OverlayContainer>
    );
};

export { Modal };
