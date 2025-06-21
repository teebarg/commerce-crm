import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const formatDate = (date?: Date) => {
    if (!date) return "N/A";

    return new Intl.DateTimeFormat("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
    }).format(date);
};
