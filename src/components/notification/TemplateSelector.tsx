"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "nui-react-icons";
import { useOverlayTriggerState } from "react-stately";
import { type NotificationTemplate } from "@prisma/client";
import { api } from "@/trpc/react";
import { Confirm } from "@/components/ui/confirm";
import { TemplateForm } from "./form";
import Overlay from "@/components/overlay";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface TemplateSelectorProps {
    templates: Array<NotificationTemplate> | undefined;
    onSelect: (template: NotificationTemplate) => void;
}

const Actions: React.FC<{ template: NotificationTemplate }> = ({ template }) => {
    const editState = useOverlayTriggerState({});
    const deleteState = useOverlayTriggerState({});
    const utils = api.useUtils();

    const mutation = api.push.deleteTemplate.useMutation({
        onSuccess: async () => {
            await utils.push.invalidate();
            deleteState.close();
        },
        onError: (error: unknown) => {
            toast.error(`Error - ${error as string}`);
        },
    });

    return (
        <div className="flex flex-row-reverse mt-4 gap-2 w-full">
            <Overlay
                open={editState.isOpen}
                title={`Edit ${template.title}`}
                trigger={
                    <Button size="iconOnly">
                        <Edit className="w-5 h-5" />
                    </Button>
                }
                onOpenChange={editState.setOpen}
            >
                <TemplateForm current={template} type="update" onClose={editState.close} />
            </Overlay>
            <Dialog open={deleteState.isOpen} onOpenChange={deleteState.setOpen}>
                <DialogTrigger asChild>
                    <Button size="iconOnly">
                        <Trash2 className="w-5 h-5 text-red-600" />
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader className="sr-only">
                        <DialogTitle>{`Delete ${template.title}`}</DialogTitle>
                    </DialogHeader>
                    <Confirm onClose={deleteState.close} onConfirm={() => void mutation.mutate(template.id)} />
                </DialogContent>
            </Dialog>
        </div>
    );
};

export function TemplateSelector({ templates, onSelect }: TemplateSelectorProps) {
    const createSlider = useOverlayTriggerState({});

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-medium text-default-900">Templates</h3>
            <Overlay
                open={createSlider.isOpen}
                title="Add template"
                trigger={
                    <Button startContent={<Plus />} variant="primary" onClick={createSlider.open}>
                        Add
                    </Button>
                }
                onOpenChange={createSlider.setOpen}
            >
                <TemplateForm onClose={createSlider.close} />
            </Overlay>
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
                        <Actions template={template} />
                    </div>
                ))}
            </div>
        </div>
    );
}
