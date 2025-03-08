"use client";

import React from "react";
import type { Pagination as PaginationType } from "@/types/generic";
import { useUpdateQuery } from "@/hooks/useUpdateQuery";

import Pagination from "@/components/pagination";
import { Plus } from "nui-react-icons";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead } from "@/components/ui/table";
import { cn } from "@/utils/utils";
import Drawer from "@/components/drawer";

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

const TableUI: React.FC<Props> = ({ columns, children, pagination, canAdd = true, canSearch = true, searchQuery, form, isDataOnly = false }) => {
    const { updateQuery } = useUpdateQuery();
    // const formWithHandler = isValidElement(form) ? cloneElement(form as React.ReactElement, { onClose: closeSlideOver }) : form;

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
                                <Drawer
                                    direction="right"
                                    trigger={
                                        <Button leftIcon={<Plus />} color="secondary">
                                            Add New
                                        </Button>
                                    }
                                >
                                    {form}
                                </Drawer>
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
                        <div className="overflow-hidden shadow sm:rounded-lg">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        {columns.map((column: string, index: number) => (
                                            <TableHead className={cn(index === columns.length - 1 && "text-right")} key={index}>
                                                {column}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>{children}</TableBody>
                            </Table>
                        </div>
                    </div>
                </div>
            </div>
            {pagination && pagination?.totalPages > 1 && <Pagination pagination={pagination} />}
        </React.Fragment>
    );
};

export { TableUI };
