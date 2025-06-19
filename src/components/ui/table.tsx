/* eslint-disable @typescript-eslint/unbound-method */
"use client";

import React, { cloneElement, isValidElement } from "react";
import type { Pagination as PaginationType } from "@/utils/types";
import { useUpdateQuery } from "@/hooks/useUpdateQuery";
import { useOverlayTriggerState } from "@react-stately/overlays";

import Pagination from "./pagination";
import SlideOver from "./slideover";
import { Plus } from "nui-react-icons";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Props {
    children: React.ReactNode;
    columns: string[];
    pagination?: PaginationType;
    canAdd?: boolean;
    canSearch?: boolean;
    searchQuery?: string;
    form?: React.ReactNode;
    isDataOnly?: boolean;
}

const Table: React.FC<Props> = ({ columns, children, pagination, canAdd = true, canSearch = true, searchQuery, form, isDataOnly = false }) => {
    const { updateQuery } = useUpdateQuery();
    const state = useOverlayTriggerState({});
    const closeSlideOver = () => {
        state.close();
    };
    const formWithHandler = isValidElement(form) ? cloneElement(form as React.ReactElement, { onClose: closeSlideOver }) : form;

    const onSearchChange = React.useCallback(
        (query: string) => {
            updateQuery([{ key: "q", value: query }]);
        },
        [updateQuery]
    );
    // const onClear = React.useCallback(() => {
    //     onSearchChange("");
    // }, [onSearchChange]);

    return (
        <React.Fragment>
            {!isDataOnly && (
                <div className="flex flex-col gap-4">
                    <div className="flex justify-between gap-3 items-center">
                        <div className="flex-1">
                            {canSearch && (
                                <Input
                                    className="w-full max-w-md"
                                    defaultValue={searchQuery}
                                    placeholder="Search by name..."
                                    onChange={(e) => onSearchChange(e.target.value)}
                                />
                            )}
                        </div>
                        <div className="flex items-center gap-3">
                            {canAdd && (
                                <Button variant="primary" leftIcon={<Plus />} className="" onClick={state.open}>
                                    Add New
                                </Button>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-default-600 text-sm">Total {pagination?.total} entries</span>
                    </div>
                </div>
            )}
            <div className="mt-4 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <div className="overflow-hidden shadow-sm sm:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-content3">
                                <thead>
                                    <tr>
                                        {columns.map((column: string, index: number) => (
                                            <th key={index} className="py-3.5 pl-4 pr-3 text-left text-xs font-semibold text-default-500" scope="col">
                                                {column}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-background">{children}</tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            {pagination && pagination?.totalPages > 1 && <Pagination pagination={pagination} />}
            {state.isOpen && (
                <SlideOver className="bg-zinc-900" isOpen={state.isOpen} title="Add New" onClose={closeSlideOver}>
                    {state.isOpen && formWithHandler}
                </SlideOver>
            )}
        </React.Fragment>
    );
};

export { Table };
