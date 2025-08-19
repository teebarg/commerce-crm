"use client";

import React, { forwardRef, useRef } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";

import { type Notification } from "@prisma/client";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { type z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { UpdateNotificationSchema } from "@/schemas/notification.schema";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Smile } from "lucide-react";
import { EMOJIS } from "@/utils/emoji";
import { Button as UIButton } from "@/components/ui/button";

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
        setValue,
    } = useForm<Form>({
        resolver: zodResolver(UpdateNotificationSchema),
        defaultValues: {
            title: notification?.title ?? "",
            body: notification?.body ?? "",
            data: (notification?.data as any) ?? undefined,
        },
    });

    const title = watch("title") || "";
    const body = watch("body") || "";
    const data = (notification?.data as any) ?? {};
    const actionUrlDefault = typeof data?.actionUrl === "string" ? data.actionUrl : "";
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const [actionUrl, setActionUrl] = React.useState<string>(actionUrlDefault);

    

    const onSubmit = (form: Form): void => {
        if (!notification) return;
        update.mutate({ ...form, id: notification.id, data: { ...(notification.data as any), actionUrl } });
    };

    return (
        <React.Fragment>
            <Card className="h-full">
                <CardHeader>
                    <CardTitle>Notification Content Update</CardTitle>
                    <CardDescription>Create your push notification content</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                        <div>
                            <Input
                                label="Title"
                                placeholder="Enter notification title"
                                maxLength={50}
                                {...register("title")}
                                error={errors.title?.message}
                                endContent={
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <UIButton size="icon" variant="ghost" aria-label="Insert emoji">
                                                <Smile className="h-4 w-4" />
                                            </UIButton>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            {EMOJIS.map((emoji) => (
                                                <DropdownMenuItem key={emoji} onClick={() => setValue("title", `${title}${emoji}`, { shouldDirty: true })}>
                                                    {emoji}
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                }
                            />
                            <p className="text-xs text-gray-500 mt-1">{title.length}/50 characters</p>
                        </div>
                        <div>
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-gray-500 mb-0.5">Message*</label>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <UIButton size="icon" variant="ghost" aria-label="Insert emoji">
                                            <Smile className="h-4 w-4" />
                                        </UIButton>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        {EMOJIS.map((emoji) => (
                                            <DropdownMenuItem key={emoji} onClick={() => setValue("body", `${body}${emoji}`, { shouldDirty: true })}>
                                                {emoji}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            <Textarea rows={4} placeholder="Enter your notification message" maxLength={200} {...register("body")} error={errors.body?.message} />
                            <p className="text-xs text-gray-500 mt-1">{body.length}/200 characters</p>
                        </div>
                        <div>
                            <Input
                                label="Action URL"
                                placeholder="https://example.com (optional)"
                                value={actionUrl}
                                onChange={(e) => setActionUrl(e.target.value)}
                            />
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
