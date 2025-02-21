"use client";

import { startTransition, useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { debounce } from "@/utils/utils";

interface QueryParam {
    key: string;
    value: string;
}

const useUpdateQuery = (delay = 500) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const updateQuery = useCallback(
        debounce((data: QueryParam[]) => {
            const params = new URLSearchParams(searchParams?.toString());

            data.forEach(({ key, value }) => {
                if (!value || value === "") {
                    params.delete(key);

                    return;
                }
                params.set(key, value);
            });

            startTransition(() => {
                router.push(`${pathname}?${params.toString()}`);
            });
        }, delay),
        [searchParams]
    );

    return { updateQuery };
};

export { useUpdateQuery };
