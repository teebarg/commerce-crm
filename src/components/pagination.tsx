"use client";

import React from "react";
import { type Pagination as PaginationType } from "@/utils/types";
import { useUpdateQuery } from "@/hooks/useUpdateQuery";
import {
    Pagination as PaginationUI,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

interface Props {
    pagination: PaginationType;
}

const Pagination: React.FC<Props> = ({ pagination }) => {
    const { updateQuery } = useUpdateQuery(100);

    const page = pagination?.page ?? 1;

    const onNextPage = React.useCallback(() => {
        updateQuery([{ key: "page", value: `${page + 1}` }]);
    }, [page, updateQuery]);

    const onPreviousPage = React.useCallback(() => {
        updateQuery([{ key: "page", value: `${page - 1}` }]);
    }, [page, updateQuery]);

    const onPageChange = React.useCallback(
        (page: number) => {
            updateQuery([{ key: "page", value: page.toString() }]);
        },
        [updateQuery]
    );

    return (
        <PaginationUI>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious disabled={page === 1} onClick={onPreviousPage} />
                </PaginationItem>
                {Array.from({ length: pagination?.totalPages }).map((_, index: number) => (
                    <PaginationItem key={index}>
                        <PaginationLink className="cursor-pointer" onClick={() => onPageChange(index + 1)} isActive={page === index + 1}>
                            {index + 1}
                        </PaginationLink>
                    </PaginationItem>
                ))}
                <PaginationItem>
                    <PaginationNext disabled={pagination?.totalPages === 1 || page == pagination?.totalPages} onClick={onNextPage} />
                </PaginationItem>
            </PaginationContent>
        </PaginationUI>
    );
};

export default Pagination;
