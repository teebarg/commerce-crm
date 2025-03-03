import { cn } from "@/utils/utils";
import * as React from "react";

export interface SelectProps extends React.InputHTMLAttributes<HTMLSelectElement> {
    error?: string;
    label?: string;
    items: { value: string; label: string }[];
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({ className, error, label, items, ...props }, ref) => {
    return (
        <div>
            {label && <label className="text-sm font-medium text-gray-500 mb-0.5 block">{label}</label>}
            <select
                ref={ref}
                {...props}
                id="status"
                className={cn(
                    "w-full h-10 pl-4 pr-10 border rounded-lg appearance-none cursor-pointer disabled:cursor-not-allowed",
                    "focus:outline-none focus:ring-0 hover:border-gray-400 transition-colors disabled:bg-gray-50 disabled:text-gray-500",
                    className
                )}
            >
                {items.map((item, index: number) => (
                    <option key={index} value={item.value}>
                        {item.label}
                    </option>
                ))}
            </select>
            {error && <p className="text-xs text-rose-500 mt-0.5">{error}</p>}
        </div>
    );
});
Select.displayName = "Select";

export { Select };
