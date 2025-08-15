"use client";

import { useRouter } from "next/navigation";
import { ArrowLongLeft } from "nui-react-icons";
import React from "react";
import { Button } from "@/components/ui/button";

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
            router.push("/");
        }
    };

    return (
        <Button aria-label="back button" onClick={handleGoBack} size="lg" variant="primary" className={className}>
            <ArrowLongLeft className="h-6 w-6" viewBox="0 0 15 15" />
            <span className="hidden md:block">Go back</span>
        </Button>
    );
};

export { BackButton };
