"use client";

import { cn } from "@/utils/utils";
import * as React from "react";
import { useId } from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLTextAreaElement> {
    error?: string;
    label?: string;
}

const TextArea = React.forwardRef<HTMLTextAreaElement, InputProps>(({ className, error, label, ...props }, ref) => {
    const id = useId();
    return (
        <div>
            {label && (
                <label htmlFor={id} className="text-sm font-medium text-gray-500 mb-0.5">
                    {label}
                </label>
            )}
            <textarea
                id={id}
                ref={ref}
                {...props}
                placeholder="What's on your mind?"
                className={cn(
                    "w-full h-32 p-4 border border-default-200 rounded-lg focus:ring-1 focus:ring-blue-50 focus:border-transparent resize-none",
                    className
                )}
            />
            {error && <p className="text-xs text-rose-500 mt-0.5">{error}</p>}
        </div>
    );
});
TextArea.displayName = "TextArea";

export { TextArea };
