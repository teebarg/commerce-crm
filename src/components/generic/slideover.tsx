import { useDialog } from "@react-aria/dialog";
import { FocusScope } from "@react-aria/focus";
import { OverlayContainer, useOverlay, usePreventScroll } from "@react-aria/overlays";
import clsx from "clsx";
import { Cancel } from "nui-react-icons";
import React from "react";

type Direction = "left" | "right";
interface SlideoverProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title?: string | React.ReactNode;
    className?: string;
    footer?: React.ReactNode;
    direction?: Direction;
}

const SlideOver: React.FC<SlideoverProps> = ({ isOpen, onClose, children, title, className, footer, direction = "right" }) => {
    usePreventScroll({ isDisabled: !isOpen });
    const ref = React.useRef<HTMLDivElement>(null);
    const { overlayProps } = useOverlay({ isOpen, onClose, isDismissable: true }, ref);
    const { dialogProps } = useDialog({}, ref);

    const location: Record<Direction, string> = {
        left: isOpen ? "translate-x-0 left-0" : "-translate-x-full left-0",
        right: isOpen ? "translate-x-0 right-0" : "translate-x-full right-0",
    };

    return (
        <OverlayContainer>
            {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-xs z-40" />}
            <FocusScope contain restoreFocus>
                <div
                    {...overlayProps}
                    {...dialogProps}
                    ref={ref}
                    className={clsx(
                        "fixed flex flex-col top-0 h-screen w-[90vw] sm:w-[25%] shadow-lg transform transition-all duration-1000 ease-in-out z-50 py-5 px-2 bg-default-50 focus-visible:outline-hidden",
                        className,
                        location[direction]
                    )}
                >
                    <button className="absolute top-4 right-2 bg-transparent z-50" onClick={onClose}>
                        <Cancel size={24} />
                    </button>
                    <div className="overflow-y-auto ppp[mask-image:linear-gradient(0deg,#000_calc(100%_-_50px),transparent)] flex flex-col flex-1">
                        <div className="text-2xl mb-4 font-semibold pl-2">{title}</div>
                        <div className="w-full h-full max-h-full flex-1 px-2">{children}</div>
                    </div>
                    {footer}
                </div>
            </FocusScope>
        </OverlayContainer>
    );
};

export { SlideOver };
