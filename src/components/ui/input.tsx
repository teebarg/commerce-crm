import * as React from "react";

import { cn } from "@/utils/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, error, label, ...props }, ref) => {
    const id = React.useId();
    return (
        <div>
            {label && (
                <label htmlFor={id} className="text-sm font-medium text-default-500 mb-0.5 block">
                    {label}
                </label>
            )}
            <input
                type={type}
                className={cn(
                    "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
                    "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground",
                    "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-2",
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
