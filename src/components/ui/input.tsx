"use client";

import { cn } from "@/utils/utils";
import * as React from "react";
import { useId } from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    type?: "text" | "email" | "password" | "number";
    error?: string;
    label?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, error, label, ...props }, ref) => {
    const id = useId();
    return (
        <div>
            {label && (
                <label htmlFor={id} className="text-sm font-medium text-default-500 mb-0.5">
                    {label}
                </label>
            )}
            <input
                id={id}
                type={type}
                className={cn(
                    "flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent",
                    "file:text-sm file:font-medium file:text-white placeholder:text-gray-500 focus-visible:outline-hidden",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    className
                )}
                ref={ref}
                {...props}
            />
            {error && <p className="text-xs text-rose-500 mt-0.5">{error}</p>}
        </div>
    );
});
Input.displayName = "Input";

export { Input };
