import { cn } from "@/utils/utils";
import * as React from "react";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    error?: string;
    label?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, error, label, ...props }, ref) => {
    const id = React.useId();
    return (
        <>
            {label && (
                <label htmlFor={id} className="text-sm font-medium text-gray-500 mb-0.5">
                    {label}
                </label>
            )}
            <textarea
                id={id}
                className={cn(
                    "w-full h-32 p-4 border rounded-lg focus:ring-1 focus:ring-blue-50 focus:border-transparent resize-none",
                    "flex min-h-[80px] border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                    className
                )}
                ref={ref}
                {...props}
            />
            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
        </>
    );
});
Textarea.displayName = "Textarea";

export { Textarea };
