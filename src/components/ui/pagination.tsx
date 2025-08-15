"use client";

import React from "react";
import { type Pagination as PaginationType } from "@/utils/types";
import { useUpdateQuery } from "@/lib/hooks/useUpdateQuery";
import { cn } from "@/utils/utils";

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
        <div className="p-2 flex justify-between items-center mt-4">
            <nav
                aria-label="pagination navigation"
                className="p-2.5 -m-2.5 overflow-x-scroll scrollbar-hide"
                data-active-page={page}
                data-controls="true"
                data-dots-jump="5"
                data-slot="base"
                data-total={pagination?.totalPages}
                role="navigation"
            >
                <ul className="flex flex-nowrap h-fit max-w-fit relative gap-1 items-center overflow-visible rounded-xl" data-slot="wrapper">
                    <span
                        aria-hidden="true"
                        className={cn(
                            "absolute flex overflow-visible items-center justify-center origin-center select-none",
                            "touch-none pointer-events-none z-20 data-[moving=true]:transition-transform !data-[moving=true]:duration-300",
                            "opacity-0 data-moving:opacity-100 min-w-9 w-9 h-9 text-sm rounded-xl bg-indigo-700 text-white"
                        )}
                        data-moving={page !== pagination?.page || false}
                        data-slot="cursor"
                        style={{ transform: `translateX(${40 * page}px) scale(1)` }}
                    >
                        {page}
                    </span>
                    <li
                        aria-disabled={pagination?.totalPages === 1 || page == 1 ? "true" : "false"}
                        aria-label="previous page button"
                        className={cn(
                            "flex flex-wrap truncate box-border items-center justify-center outline-hidden data-[disabled=true]:opacity-50",
                            "data-[disabled=true]:pointer-events-none [&[data-hover=true]:not([data-active=true])]:bg-gray-200",
                            "min-w-9 w-9 h-9 text-sm rounded-xl"
                        )}
                        data-disabled={pagination?.totalPages === 1 || page == 1 ? "true" : "false"}
                        data-slot="prev"
                        role="button"
                        onClick={onPreviousPage}
                        onMouseEnter={(e) => e.currentTarget.setAttribute("data-hover", "true")}
                        onMouseLeave={(e) => e.currentTarget.removeAttribute("data-hover")}
                    >
                        <svg aria-hidden="true" fill="none" focusable="false" height="1em" role="presentation" viewBox="0 0 24 24" width="1em">
                            <path d="M15.5 19l-7-7 7-7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                        </svg>
                    </li>
                    {Array.from({ length: pagination?.totalPages }).map((_, index: number) => (
                        <li
                            key={index}
                            aria-current={page == index + 1 ? "true" : undefined}
                            aria-label={`pagination item ${index + 1} ${page == index + 1 ? "active" : ""}`}
                            className={cn(
                                "select-none touch-none bg-gray-400 transition-transform-background flex flex-wrap truncate",
                                "box-border items-center justify-center text-white outline-hidden data-[disabled=true]:text-gray-100",
                                "data-[disabled=true]:pointer-events-none [&[data-hover=true]:not([data-active=true])]:bg-gray-500",
                                "active:bg-gray-500 min-w-9 w-9 h-9 text-sm rounded-xl"
                            )}
                            data-active={page === index + 1 ? "true" : undefined}
                            data-slot="item"
                            role="button"
                            tabIndex={0}
                            onClick={() => onPageChange(index + 1)}
                            onMouseEnter={(e) => e.currentTarget.setAttribute("data-hover", "true")}
                            onMouseLeave={(e) => e.currentTarget.removeAttribute("data-hover")}
                        >
                            {index + 1}
                        </li>
                    ))}
                    <li
                        aria-disabled={pagination?.totalPages === 1 || page == pagination?.totalPages ? "true" : "false"}
                        aria-label="next page button"
                        className={cn(
                            "flex flex-wrap truncate box-border items-center justify-center outline-hidden data-[disabled=true]:opacity-50",
                            "data-[disabled=true]:pointer-events-none [&[data-hover=true]:not([data-active=true])]:bg-gray-200",
                            "min-w-9 w-9 h-9 text-sm rounded-xl"
                        )}
                        data-disabled={pagination?.totalPages === 1 || page == pagination?.totalPages ? "true" : "false"}
                        data-slot="next"
                        role="button"
                        onClick={onNextPage}
                        onMouseEnter={(e) => e.currentTarget.setAttribute("data-hover", "true")}
                        onMouseLeave={(e) => e.currentTarget.removeAttribute("data-hover")}
                    >
                        <svg
                            aria-hidden="true"
                            className="rotate-180"
                            fill="none"
                            focusable="false"
                            height="1em"
                            role="presentation"
                            viewBox="0 0 24 24"
                            width="1em"
                        >
                            <path d="M15.5 19l-7-7 7-7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                        </svg>
                    </li>
                </ul>
            </nav>
            <div className="hidden sm:flex w-[30%] justify-end gap-2">
                <button
                    className="bg-indigo-500 text-white py-2 rounded-xl min-w-20 disabled:opacity-50"
                    disabled={pagination?.totalPages === 1 || page == 1}
                    onClick={onPreviousPage}
                >
                    Previous
                </button>
                <button
                    className="bg-indigo-500 text-white py-2 rounded-xl min-w-20 disabled:opacity-50"
                    disabled={pagination?.totalPages === 1 || page == pagination?.totalPages}
                    onClick={onNextPage}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Pagination;
