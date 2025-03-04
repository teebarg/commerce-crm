"use client";

import { Edit, Eye, Trash } from "nui-react-icons";
import React, { cloneElement, isValidElement, useState } from "react";
import { useOverlayTriggerState } from "react-stately";
import { useSnackbar } from "notistack";
import { useRouter } from "next/navigation";
import { Confirm } from "@/components/ui/confirm";
import Drawer from "@/components/drawer";
import { Button } from "@/components/ui/button2";

interface Props {
    label?: string;
    item: Record<any, any>;
    form: React.ReactNode;
    showDetails?: boolean;
    deleteAction?: (id: string) => Promise<void>;
}

const Actions: React.FC<Props> = ({ label, item, form, showDetails = true, deleteAction }) => {
    const { enqueueSnackbar } = useSnackbar();
    const deleteModalState = useOverlayTriggerState({});
    const slideOverState = useOverlayTriggerState({});
    const formWithHandler = isValidElement(form) ? cloneElement(form as React.ReactElement, { onClose: slideOverState.close }) : form;
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState<boolean>(false);

    const onConfirmDelete = async (id: string) => {
        try {
            setIsDeleting(true);
            await deleteAction?.(id);
            router.refresh();
            deleteModalState.close();
        } catch (error) {
            enqueueSnackbar(`Error deleting ${label} - ${error as string}`, { variant: "error" });
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <React.Fragment>
            <div className="relative flex items-center gap-2">
                {showDetails && (
                    // <Tooltip content="Details">
                    <span className="text-lg text-gray-500 cursor-pointer active:opacity-50">
                        <Eye />
                    </span>
                    // </Tooltip>
                )}
                {/* <Tooltip content={`Edit ${label}`}> */}
                {/* <span className="text-lg text-gray-500 cursor-pointer active:opacity-50">
                    <Edit onClick={() => slideOverState.open()} />
                </span> */}
                <Drawer
                    open={slideOverState.isOpen}
                    onOpenChange={slideOverState.setOpen}
                    direction="right"
                    title={`Edit ${label}`}
                    trigger={
                        <Button size="icon" variant="ghost">
                            <Edit />
                        </Button>
                    }
                >
                    {formWithHandler}
                </Drawer>
                {/* </Tooltip> */}
                {/* <Tooltip content={`Delete ${label}`}> */}
                {/* <span className="text-lg text-danger cursor-pointer active:opacity-50">
                    <Delete onClick={() => onDelete(item)} />
                </span> */}
                <Drawer
                    // shouldScaleBackground={false}
                    open={deleteModalState.isOpen}
                    onOpenChange={deleteModalState.setOpen}
                    direction="top"
                    trigger={
                        <Button size="icon" variant="ghost">
                            <Trash />
                        </Button>
                    }
                    action={
                        <Button isLoading={isDeleting} onClick={() => onConfirmDelete(item?.id)} type="button" variant="destructive">
                            Delete
                        </Button>
                    }
                >
                    <Confirm title="Delete template?" content={`Are you sure you want to delete ${label}? This action cannot be undone.`} />
                </Drawer>
                {/* </Tooltip> */}
            </div>
        </React.Fragment>
    );
};

export { Actions };
