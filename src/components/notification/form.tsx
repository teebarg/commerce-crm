"use client";

import React, { forwardRef, useRef } from "react";
import { type NotificationTemplate } from "@prisma/client";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { type z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";
import { notificationTemplateSchema } from "@/trpc/schema";

type Form = z.infer<typeof notificationTemplateSchema>;

interface Props {
    current?: NotificationTemplate;
    onSubmit: (data: Form) => void;
}

interface ChildRef {
    submit: () => void;
}

const TemplateForm = forwardRef<ChildRef, Props>(({ onSubmit, current }, _ref) => {
    const formRef = useRef<HTMLFormElement>(null);

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

    const onSubmit2 = (data: Form): void => {
        onSubmit(data);
    };

    return (
        <React.Fragment>
            <div className="mx-auto w-full">
                <form id="notification-form" ref={formRef} onSubmit={handleSubmit(onSubmit2)} className="space-y-8">
                    <Input
                        type="text"
                        id="title"
                        label="Title"
                        {...register("title", {
                            required: "Title is required.",
                        })}
                        error={errors.title?.message}
                        className="mt-1 shadow-sm sm:text-sm"
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
                        className="mt-1 shadow-sm sm:text-sm"
                        placeholder="Excerpt"
                    />
                    <Input label="Icon (emoji or URL)" type="text" id="icon" {...register("icon")} className="mt-1" placeholder="🔔" />
                    <Textarea
                        label="Message"
                        id="body"
                        {...register("body", {
                            required: "Message is required.",
                        })}
                        error={errors.body?.message}
                        className="mt-1"
                        placeholder="Notification message..."
                    />
                </form>
            </div>
        </React.Fragment>
    );
});

TemplateForm.displayName = "TemplateForm";

export { TemplateForm };
