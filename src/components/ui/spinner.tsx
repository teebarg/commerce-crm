import { cn } from "@/utils/utils";
import React from "react";

interface Props {
    className?: string;
    size?: "sm" | "md" | "lg";
}

const Spinner: React.FC<Props> = ({ size = "sm", className }) => {
    return (
        <div aria-label="spinner" className={cn("", className)}>
            <div
                className={cn("relative", {
                    "w-5 h-5": size === "sm",
                    "w-8 h-8": size === "md",
                    "w-10 h-10": size === "lg",
                })}
            >
                <i
                    className={cn(
                        "absolute inset-0 w-full h-full rounded-full animate-spinner-ease-spin border-solid border-t-transparent border-l-transparent border-r-transparent border-3 border-b-blue-500"
                    )}
                />
                <i
                    className={cn(
                        "absolute inset-0 w-full h-full rounded-full opacity-75 animate-spinner-linear-spin border-dotted border-t-transparent border-l-transparent border-r-transparent border-3 border-b-blue-500"
                    )}
                />
            </div>
        </div>
    );
};

export { Spinner };
