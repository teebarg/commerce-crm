/* eslint-disable @typescript-eslint/restrict-template-expressions */

import clsx, { type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

const buildUrl = (baseUrl: string, queryParams: Record<string, string | number | Date | undefined | null>): string => {
    let url = baseUrl;
    let firstQueryParam = true;

    for (const key in queryParams) {
        if (!queryParams[key]) continue;
        // eslint-disable-next-line no-prototype-builtins
        if (queryParams.hasOwnProperty(key)) {
            if (firstQueryParam) {
                url += `?${key}=${queryParams[key]}`;
                firstQueryParam = false;
            } else {
                url += `&${key}=${queryParams[key]}`;
            }
        }
    }

    return url;
};

// eslint-disable-next-line
const debounce = <T extends (...args: any[]) => void>(func: T, delay: number): ((...args: Parameters<T>) => void) => {
    let timer: NodeJS.Timeout;

    return (...args: Parameters<T>) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func(...args);
        }, delay);
    };
};

// Helper function to format timestamps into "time ago"
const timeAgo = (timestamp: string) => {
    const now = new Date();
    const activityDate = new Date(timestamp);
    const diff = Math.floor((now.getTime() - activityDate.getTime()) / 1000);

    if (diff < 60) return `${diff} seconds ago`;
    else if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    else if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    else return `${Math.floor(diff / 86400)} days ago`;
};

const cn = (...inputs: ClassValue[]) => {
    return twMerge(clsx(inputs));
}

export { buildUrl, cn, debounce, timeAgo };
