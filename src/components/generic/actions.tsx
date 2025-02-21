/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
"use client";

import { Delete, Edit, Eye } from "nui-react-icons";
import React, { cloneElement, isValidElement, useState } from "react";
import { useOverlayTriggerState } from "react-stately";
import { useSnackbar } from "notistack";
import { useRouter } from "next/navigation";
import { Tooltip } from "@/components/ui/tooltip";
import { Modal } from "@/components/ui/modal";
import { Confirm } from "@/components/ui/confirm";
import SlideOver from "@/components/ui/slideover";

interface Props {
    label?: string;
    item: unknown;
    form: React.ReactNode;
    showDetails?: boolean;
    deleteAction?: (id: string) => Promise<void>;
}

const Actions: React.FC<Props> = ({ label, item, form, showDetails = true, deleteAction }) => {
    const { enqueueSnackbar } = useSnackbar();
    const [current, setCurrent] = useState<any>({ is_active: true });
    const deleteModalState = useOverlayTriggerState({});
    const slideOverState = useOverlayTriggerState({});
    const formWithHandler = isValidElement(form) ? cloneElement(form as React.ReactElement, { onClose: slideOverState.close }) : form;
    const router = useRouter();

    const onDelete = (value: any) => {
        setCurrent((prev: any) => ({ ...prev, ...value }));
        deleteModalState.open();
    };

    const onConfirmDelete = async () => {
        try {
            await deleteAction?.(current.id);
            router.refresh();
            deleteModalState.close();
        } catch (error) {
            enqueueSnackbar(`Error deleting ${label} - ${error as string}`, { variant: "error" });
        }
    };

    return (
        <React.Fragment>
            <div className="relative flex items-center gap-2">
                {showDetails && (
                    <Tooltip content="Details">
                        <span className="text-lg text-gray-500 cursor-pointer active:opacity-50">
                            <Eye />
                        </span>
                    </Tooltip>
                )}
                <Tooltip content={`Edit ${label}`}>
                    <span className="text-lg text-gray-500 cursor-pointer active:opacity-50">
                        <Edit onClick={() => slideOverState.open()} />
                    </span>
                </Tooltip>
                <Tooltip content={`Delete ${label}`}>
                    <span className="text-lg text-danger cursor-pointer active:opacity-50">
                        <Delete onClick={() => onDelete(item)} />
                    </span>
                </Tooltip>
            </div>
            {/* Delete Modal */}
            {deleteModalState.isOpen && (
                <Modal isOpen={deleteModalState.isOpen} onClose={deleteModalState.close}>
                    <Confirm onClose={deleteModalState.close} onConfirm={onConfirmDelete} />
                </Modal>
            )}
            {slideOverState.isOpen && (
                <SlideOver isOpen={slideOverState.isOpen} title={`Edit ${label}`} onClose={slideOverState.close}>
                    {slideOverState.isOpen && formWithHandler}
                </SlideOver>
            )}
        </React.Fragment>
    );
};

export { Actions };
