"use client";

import { Button } from "@/components/ui/button";
import { Pencil, Plus, Trash } from "nui-react-icons";
import { useState } from "react";
import { useOverlayTriggerState } from "react-stately";
import { type NotificationTemplate } from "@prisma/client";
import { api } from "@/trpc/react";
import { useSnackbar } from "notistack";
import { Modal } from "@/components/ui/modal";
import { Confirm } from "@/components/ui/confirm";
import SlideOver from "@/components/ui/slideover";
import { TemplateForm } from "./form";

interface TemplateSelectorProps {
    templates: Array<NotificationTemplate> | undefined;
    onSelect: (template: NotificationTemplate) => void;
}

export function TemplateSelector({ templates, onSelect }: TemplateSelectorProps) {
    const [id, setId] = useState<string>("");
    const [template, setTemplate] = useState<any>(null);
    const confirmationModal = useOverlayTriggerState({});
    const createSlider = useOverlayTriggerState({});
    const editSlider = useOverlayTriggerState({});
    const { enqueueSnackbar } = useSnackbar();
    const utils = api.useUtils();

    const mutation = api.push.deleteTemplate.useMutation({
        onSuccess: async () => {
            await utils.push.invalidate();
            confirmationModal.close();
        },
        onError: (error: unknown) => {
            enqueueSnackbar(`Error - ${error as string}`, { variant: "error" });
        },
    });

    const handleDelete = (id: string) => {
        setId(id);
        confirmationModal.open();
    };

    const handleEdit = (template: any) => {
        setTemplate(template);
        editSlider.open();
    };

    return (
        <>
            <div className="space-y-4">
                <h3 className="text-lg font-medium text-default-900">Templates</h3>
                <div>
                    <Button leftIcon={<Plus />} color="primary" onClick={createSlider.open}>
                        Add
                    </Button>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {templates?.map((template) => (
                        <div
                            key={template.id}
                            onClick={() => onSelect(template)}
                            className="relative rounded-lg border border-gray-300 bg-content1 px-6 py-5 shadow-xs flex flex-col items-start focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <div className="flex-1">
                                <span className="text-2xl mb-2 block">{template.icon}</span>
                                <h3 className="text-sm font-medium text-default-900">{template.title}</h3>
                                <p className="mt-1 text-sm text-default-500">{template.excerpt}</p>
                            </div>
                            <div className="flex flex-row-reverse mt-4 gap-2 w-full">
                                <Button color="danger" onClick={() => handleDelete(template.id)} className="min-w-0">
                                    <Trash />
                                </Button>
                                <Button color="secondary" onClick={() => handleEdit(template)} className="min-w-0">
                                    <Pencil />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {createSlider.isOpen && (
                <SlideOver className="bg-zinc-900" isOpen={createSlider.isOpen} title="Add template" onClose={createSlider.close}>
                    {createSlider.isOpen && <TemplateForm onClose={createSlider.close} />}
                </SlideOver>
            )}
            {editSlider.isOpen && (
                <SlideOver className="bg-zinc-900" isOpen={editSlider.isOpen} title="Edit template" onClose={editSlider.close}>
                    {editSlider.isOpen && <TemplateForm current={template} type="update" onClose={editSlider.close} />}
                </SlideOver>
            )}

            {confirmationModal.isOpen && (
                <Modal isOpen={confirmationModal.isOpen} onClose={confirmationModal.close}>
                    <Confirm
                        title="Delete template?"
                        content="Are you sure you want to delete this template? This action cannot be undone."
                        onClose={confirmationModal.close}
                        onConfirm={() => void mutation.mutate(id)}
                    />
                </Modal>
            )}
        </>
    );
}
