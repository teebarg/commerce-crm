import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const formatDate = (date?: Date | null) => {
    if (!date) return "N/A";

    return new Intl.DateTimeFormat("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
    }).format(date);
};

export const currency = (number: number): string => {
    return number?.toLocaleString("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 });
};
