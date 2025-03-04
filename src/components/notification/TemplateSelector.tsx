"use client";

import { Button } from "@/components/ui/button";
import { Pencil, Plus, Trash } from "nui-react-icons";
import { useState } from "react";
import { type NotificationTemplate } from "@prisma/client";
import { api } from "@/trpc/react";
import { useSnackbar } from "notistack";
import { Confirm } from "@/components/ui/confirm";
import { TemplateForm } from "./form";
import Drawer from "@/components/drawer";


interface TemplateSelectorProps {
    templates: Array<NotificationTemplate> | undefined;
    onSelect: (template: NotificationTemplate) => void;
}

export function TemplateSelector({ templates, onSelect }: TemplateSelectorProps) {
    const { enqueueSnackbar } = useSnackbar();
    const utils = api.useUtils();

    const mutation = api.push.deleteTemplate.useMutation({
        onSuccess: async () => {
            await utils.push.invalidate();
        },
        onError: (error: unknown) => {
            enqueueSnackbar(`Error - ${error as string}`, { variant: "error" });
        },
    });

    const create = api.push.createTemplate.useMutation({
        onSuccess: async () => {
            enqueueSnackbar("Template created successfully", { variant: "success" });
            await utils.push.invalidate();
        },
        onError: (error) => {
            enqueueSnackbar(`Error - ${error as unknown as string}`, { variant: "error" });
        },
    });

    const update = api.push.updateTemplate.useMutation({
        onSuccess: async () => {
            enqueueSnackbar("Template updated successfully", { variant: "success" });
            await utils.push.invalidate();
            // router.refresh();
        },
        onError: (error: unknown) => {
            enqueueSnackbar(`Error - ${error as string}`, { variant: "error" });
        },
    });

    return (
        <>
            <div className="space-y-4">
                <h3 className="text-lg font-medium text-default-900">Templates</h3>
                <div>
                    <Drawer
                        direction="right"
                        title="Create Template"
                        trigger={
                            <Button leftIcon={<Plus />} color="primary">
                                Add
                            </Button>
                        }
                        action={
                            <Button isLoading={create.isPending} form="my-drawer-form" type="submit" color="danger" className="h-10 rounded-md px-8">
                                Proceed
                            </Button>
                        }
                    >
                        <TemplateForm onSubmit={(formData) => create.mutate(formData)} />
                    </Drawer>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {templates?.map((template) => (
                        <div
                            key={template.id}
                            onClick={() => onSelect(template)}
                            className="relative rounded-lg border border-gray-300 bg-content1 px-6 py-5 shadow-sm flex flex-col items-start focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <div className="flex-1">
                                <span className="text-2xl mb-2 block">{template.icon}</span>
                                <h3 className="text-sm font-medium text-default-900">{template.title}</h3>
                                <p className="mt-1 text-sm text-default-500">{template.excerpt}</p>
                            </div>
                            <div className="flex flex-row-reverse mt-4 gap-2 w-full">
                                <Drawer
                                    shouldScaleBackground={false}
                                    direction="top"
                                    trigger={
                                        <Button color="danger" className="min-w-0">
                                            <Trash />
                                        </Button>
                                    }
                                    action={
                                        <Button
                                            onClick={() => void mutation.mutate(template.id)}
                                            isLoading={mutation.isPending}
                                            type="button"
                                            color="danger"
                                            className="h-10 rounded-md px-8"
                                        >
                                            Delete
                                        </Button>
                                    }
                                >
                                    <Confirm
                                        title="Delete template?"
                                        content={`Are you sure you want to delete template ${template.title}? This action cannot be undone.`}
                                    />
                                </Drawer>
                                <Drawer
                                    direction="right"
                                    title={`Edit ${template.title}`}
                                    trigger={
                                        <Button color="secondary" className="min-w-0">
                                            <Pencil />
                                        </Button>
                                    }
                                    action={
                                        <Button
                                            isLoading={create.isPending || update.isPending}
                                            form="my-drawer-form"
                                            type="submit"
                                            color="danger"
                                            className="h-10 rounded-md px-8"
                                        >
                                            Update
                                        </Button>
                                    }
                                >
                                    <TemplateForm
                                        onSubmit={(formData) => update.mutate({ ...formData, id: template.id })}
                                        current={template}
                                        type="update"
                                    />
                                </Drawer>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
