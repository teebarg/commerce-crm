import { startTransition, useCallback, useMemo } from "react";
import { debounce } from "@/utils/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useProgressBar } from "@/components/ui/progress-bar";

interface QueryParam {
    key: string;
    value: string;
}

const useUpdateQuery = (delay = 500) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const progress = useProgressBar();

    const updateQuery = useMemo(() => {
        const fn = debounce((data: QueryParam[]) => {
            const params = new URLSearchParams(searchParams.toString());

            data.forEach(({ key, value }) => {
                if (!value || value === "") {
                    params.delete(key);
                } else {
                    params.set(key, value);
                }
            });

            progress.start();

            startTransition(() => {
                router.push(`${pathname}?${params.toString()}`);
                progress.done();
            });
        }, delay);

        return fn;
    }, [searchParams, pathname, router, progress, delay]);

    return { updateQuery };
};

export { useUpdateQuery };
