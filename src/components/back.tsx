"use client";

import { cn } from "@/utils/utils";
import { useRouter } from "next/navigation";
import { ArrowLongLeft } from "nui-react-icons";
import React from "react";

interface Props {
    className?: string;
    onClick?: () => void;
}

const BackButton: React.FC<Props> = ({ onClick, className }) => {
    const router = useRouter();
    const handleGoBack = () => {
        if (onClick) {
            onClick();

            return;
        }

        if (window.history.length > 1) {
            router.back();
        } else {
            router.push("/"); // Navigate to a fallback route
        }
    };

    return (
        <button
            aria-label="back button"
            className={cn(
                className,
                "bg-indigo-700 text-white relative inline-flex items-center justify-center text-base gap-2 rounded-xl",
                "font-medium transition transition-transform-colors-opacity hover:opacity-80 px-6 min-w-20 h-12"
            )}
            onClick={handleGoBack}
        >
            <ArrowLongLeft className="h-6 w-6" viewBox="0 0 15 15" />
            <span className="hidden md:block">Go back</span>
        </button>
    );
};

export { BackButton };
