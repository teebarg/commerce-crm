"use client";

import React, { forwardRef, useRef } from "react";
import { useSnackbar } from "notistack";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";

import { type NotificationTemplate } from "@prisma/client";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { type z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { TextArea } from "@/components/ui/textarea";
import { notificationTemplateSchema } from "@/trpc/schema";

interface Props {
    current?: NotificationTemplate;
    type?: "create" | "update";
    onClose?: () => void;
}

interface ChildRef {
    submit: () => void;
}

const TemplateForm = forwardRef<ChildRef, Props>(({ type = "create", onClose, current }, _ref) => {
    const router = useRouter();
    const isCreate = type === "create";
    const utils = api.useUtils();

    const { enqueueSnackbar } = useSnackbar();

    const create = api.push.createTemplate.useMutation({
        onSuccess: async () => {
            enqueueSnackbar("Template created successfully", { variant: "success" });
            await utils.push.invalidate();
            if (formRef.current) {
                formRef.current.reset();
                router.refresh();
                onClose?.();
            }
        },
        onError: (error) => {
            enqueueSnackbar(`Error - ${error as unknown as string}`, { variant: "error" });
        },
    });

    const update = api.push.updateTemplate.useMutation({
        onSuccess: async () => {
            enqueueSnackbar("Template updated successfully", { variant: "success" });
            await utils.push.invalidate();
            router.refresh();
        },
        onError: (error: unknown) => {
            enqueueSnackbar(`Error - ${error as string}`, { variant: "error" });
        },
    });

    const formRef = useRef<HTMLFormElement>(null);

    type Form = z.infer<typeof notificationTemplateSchema>;

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Form>({
        resolver: zodResolver(notificationTemplateSchema),
        defaultValues: {
            ...current,
        },
    });

    interface UpdateData extends Form {
        id: NotificationTemplate["id"];
    }

    const onSubmit = (data: Form): void => {
        if (isCreate) {
            create.mutate(data);
        } else {
            if (!current) return;
            const updateData: UpdateData = { ...data, id: current.id };
            update.mutate(updateData);
        }
    };

    return (
        <React.Fragment>
            <div className="mx-auto w-full">
                <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    <Input
                        type="text"
                        id="title"
                        label="Title"
                        {...register("title", {
                            required: "Title is required.",
                        })}
                        error={errors.title?.message}
                        className="mt-1 shadow-xs sm:text-sm"
                        placeholder="Notification Title"
                    />
                    <Input
                        type="text"
                        id="excerpt"
                        label="Excerpt"
                        {...register("excerpt", {
                            required: "Excerpt is required.",
                        })}
                        error={errors.excerpt?.message}
                        className="mt-1 shadow-xs sm:text-sm"
                        placeholder="Excerpt"
                    />
                    <Input label="Icon (emoji or URL)" type="text" id="icon" {...register("icon")} className="mt-1" placeholder="🔔" />
                    <TextArea
                        label="Message"
                        id="body"
                        {...register("body", {
                            required: "Message is required.",
                        })}
                        error={errors.body?.message}
                        className="mt-1"
                        placeholder="Notification message..."
                    />
                    <div className="flex justify-end space-x-2">
                        <Button type="button" variant="destructive" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button isLoading={create.isPending || update.isPending} variant="primary" type="submit">
                            {isCreate ? "Create" : "Update"}
                        </Button>
                    </div>
                </form>
            </div>
        </React.Fragment>
    );
});

TemplateForm.displayName = "TemplateForm";

export { TemplateForm };
