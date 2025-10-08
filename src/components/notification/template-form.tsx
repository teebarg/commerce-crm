"use client";
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import React, { forwardRef, useRef } from "react";
import { api } from "@/trpc/react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { CreateNotificationTemplateSchema } from "@/schemas/notification.schema";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { type NotificationTemplate } from "@prisma/client";

const NOTIFICATION_CATEGORIES = ["GENERIC", "ONBOARDING", "ENGAGEMENT", "REMINDER", "ANALYTICS"];

interface Props {
    template?: NotificationTemplate;
    onClose?: () => void;
    mode: "create" | "update";
}

interface ChildRef {
    submit: () => void;
}

const TemplateForm = forwardRef<ChildRef, Props>(({ onClose, template, mode }, _ref) => {
    const utils = api.useUtils();

    const create = api.push.createTemplate.useMutation({
        onSuccess: async () => {
            toast.success("Template created successfully");
            await utils.push.invalidate();
            onClose?.();
        },
        onError: (error: unknown) => {
            toast.error(`Error - ${error as string}`);
        },
    });

    const update = api.push.updateTemplate.useMutation({
        onSuccess: async () => {
            toast.success("Template updated successfully");
            await utils.push.invalidate();
        },
        onError: (error: unknown) => {
            toast.error(`Error - ${error as string}`);
        },
    });

    const formRef = useRef<HTMLFormElement>(null);

    const schema = mode === "create" ? CreateNotificationTemplateSchema : CreateNotificationTemplateSchema;
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
    } = useForm<any>({
        resolver: zodResolver(schema),
        defaultValues: mode === "update" && template ? template : {},
    });

    const title = watch("title") ?? "";
    const body = watch("body") ?? "";
    const code = watch("code") ?? "";
    const data = watch("data") ?? "";

    const onSubmit = (data: any): void => {
        if (mode === "update" && template) {
            update?.mutate({ ...data, id: template.id });
        } else {
            create.mutate(data);
        }
    };

    // Handle JSON input for data
    function handleDataChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
        try {
            setValue("data", JSON.parse(e.target.value));
        } catch {
            setValue("data", e.target.value);
        }
    }

    return (
        <React.Fragment>
            <Card className="h-full">
                <CardHeader>
                    <CardTitle>Template Content {mode === "create" ? "Create" : "Update"}</CardTitle>
                    <CardDescription>{mode === "create" ? "Create" : "Update"} your push notification template</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                        <div>
                            <Input
                                label="Code"
                                placeholder="Unique code for this template"
                                maxLength={50}
                                {...register("code")}
                                error={typeof errors.code?.message === "string" ? errors.code.message : undefined}
                                disabled={mode === "update"}
                            />
                            <p className="text-xs text-muted-foreground mt-1">{code.length}/50 characters</p>
                        </div>
                        <div>
                            <Input
                                label="Title"
                                placeholder="Enter template title"
                                maxLength={50}
                                {...register("title")}
                                error={typeof errors.title?.message === "string" ? errors.title.message : undefined}
                            />
                            <p className="text-xs text-muted-foreground mt-1">{title.length}/50 characters</p>
                        </div>
                        <div>
                            <Textarea
                                label="Body*"
                                rows={4}
                                placeholder="Enter your template body"
                                maxLength={200}
                                {...register("body")}
                                error={typeof errors.body?.message === "string" ? errors.body.message : undefined}
                            />
                            <p className="text-xs text-muted-foreground mt-1">{body.length}/200 characters</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground mb-0.5 block">Category</label>
                            <select className="w-full border rounded-md px-2 py-2" {...register("category")}>
                                {NOTIFICATION_CATEGORIES.map((opt) => (
                                    <option key={opt} value={opt}>
                                        {opt}
                                    </option>
                                ))}
                            </select>
                            {typeof errors.category?.message === "string" && (
                                <p className="text-xs text-rose-500 mt-0.5">{errors.category.message}</p>
                            )}
                        </div>
                        <div>
                            <Textarea
                                label="Data (JSON)"
                                rows={4}
                                placeholder='{"key": "value"}'
                                value={typeof data === "string" ? data : JSON.stringify(data, null, 2)}
                                onChange={handleDataChange}
                                error={typeof errors.data?.message === "string" ? errors.data.message : undefined}
                            />
                        </div>
                        <div className="flex justify-end space-x-2">
                            <Button type="button" variant="destructive" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button isLoading={create.isPending || update?.isPending} variant="primary" type="submit">
                                {mode === "create" ? "Create" : "Update"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </React.Fragment>
    );
});

TemplateForm.displayName = "TemplateForm";

export { TemplateForm };
