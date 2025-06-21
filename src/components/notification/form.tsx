"use client";

import React, { forwardRef, useRef } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";

import { Notification } from "@prisma/client";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { type z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { UpdateNotificationSchema } from "@/schemas/notification.schema";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

interface Props {
    notification?: Notification;
    onClose?: () => void;
}

interface ChildRef {
    submit: () => void;
}

const NotificationForm = forwardRef<ChildRef, Props>(({ onClose, notification }, _ref) => {
    const router = useRouter();
    const utils = api.useUtils();

    const update = api.push.updateNotification.useMutation({
        onSuccess: async () => {
            toast.success("Notification updated successfully");
            await utils.push.invalidate();
            router.refresh();
        },
        onError: (error: unknown) => {
            toast.error(`Error - ${error as string}`);
        },
    });

    const formRef = useRef<HTMLFormElement>(null);

    type Form = z.infer<typeof UpdateNotificationSchema>;

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<Form>({
        resolver: zodResolver(UpdateNotificationSchema),
        defaultValues: notification,
    });

    const title = watch("title") || "";
    const body = watch("body") || "";

    const onSubmit = (data: Form): void => {
        if (!notification) return;
        update.mutate({ ...data, id: notification.id });
    };

    return (
        <React.Fragment>
            <Card className="h-full">
                <CardHeader>
                    <CardTitle>Notification Content</CardTitle>
                    <CardDescription>Create your push notification content</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                        <div>
                            <Input label="Title" placeholder="Enter notification title" maxLength={50} {...register("title")} error={errors.title?.message} />
                            <p className="text-xs text-gray-500 mt-1">{title.length}/50 characters</p>
                        </div>
                        <div>
                            <Textarea label="Message*" rows={4} placeholder="Enter your notification message" maxLength={200} {...register("body")} error={errors.body?.message} />
                            <p className="text-xs text-gray-500 mt-1">{body.length}/200 characters</p>
                        </div>
                        <div>
                            <Input label="Image URL" placeholder="https://example.com/image.png (optional)" {...register("imageUrl")} error={errors.imageUrl?.message} />
                        </div>
                        <div className="flex justify-end space-x-2">
                            <Button type="button" variant="destructive" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button isLoading={update.isPending} variant="primary" type="submit">
                                Update
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </React.Fragment>
    );
});

NotificationForm.displayName = "NotificationForm";

export { NotificationForm };
