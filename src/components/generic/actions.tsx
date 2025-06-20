/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
"use client";

import { Edit, Eye } from "nui-react-icons";
import React, { cloneElement, isValidElement } from "react";
import { useOverlayTriggerState } from "react-stately";
import { useRouter } from "next/navigation";
import { Tooltip } from "@/components/ui/tooltip";
import { Confirm } from "@/components/ui/confirm";
import Overlay from "@/components/overlay";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Props {
    label?: string;
    item: unknown;
    form: React.ReactNode;
    showDetails?: boolean;
    deleteAction?: (id: string) => Promise<void>;
}

const Actions: React.FC<Props> = ({ label, item, form, showDetails = true, deleteAction }) => {
    const editState = useOverlayTriggerState({});
    const deleteState = useOverlayTriggerState({});
    const formWithHandler = isValidElement(form) ? cloneElement(form as React.ReactElement, { onClose: editState.close }) : form;
    const router = useRouter();

    const onConfirmDelete = async () => {
        try {
            await deleteAction?.((item as any).id);
            router.refresh();
            deleteState.close();
        } catch (error) {
            toast.error(`Error deleting ${label} - ${error as string}`);
        }
    };

    return (
        <div className="relative flex items-center gap-2">
            {showDetails && (
                <Tooltip content="Details">
                    <span className="text-lg text-gray-500 cursor-pointer active:opacity-50">
                        <Eye />
                    </span>
                </Tooltip>
            )}
            <Overlay
                open={editState.isOpen}
                title={`Edit ${label}`}
                trigger={
                    <Button size="iconOnly">
                        <Edit />
                    </Button>
                }
                onOpenChange={editState.setOpen}
            >
                {formWithHandler}
            </Overlay>
            <Dialog open={deleteState.isOpen} onOpenChange={deleteState.setOpen}>
                <DialogTrigger>
                    <Trash2 className="w-5 h-5 text-red-600" />
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader className="sr-only">
                        <DialogTitle>{`Delete ${label}`}</DialogTitle>
                    </DialogHeader>
                    <Confirm onClose={deleteState.close} onConfirm={onConfirmDelete} />
                </DialogContent>
            </Dialog>
        </div>
    );
};

export { Actions };
