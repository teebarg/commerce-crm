"use client";

import type { NotificationPreview as NotificationPreviewType } from "@/utils/types";
import { Button } from "@/components/ui/button";
import { Bell, Send } from "nui-react-icons";
import { api } from "@/trpc/react";
import { useSnackbar } from "notistack";

interface NotificationPreviewProps {
    notification: NotificationPreviewType;
}

export function NotificationPreview({ notification }: NotificationPreviewProps) {
    const utils = api.useUtils();

    const { enqueueSnackbar } = useSnackbar();

    const mutation = api.push.notify.useMutation({
        onSuccess: async () => {
            enqueueSnackbar("Notification sent successfully.", { variant: "success" });
            await utils.push.invalidate();
        },
        onError: (error: unknown) => {
            enqueueSnackbar(`Error - ${error as string}`, { variant: "error" });
        },
    });

    const onSubmit = (): void => {
        mutation.mutate({
            title: `${notification.icon} ${notification.title}`,
            body: notification.body,
            group: "bot",
        });
    };

    return (
        <>
            <div className="max-w-sm w-full bg-content2 shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5">
                <div className="p-4">
                    <div className="flex items-start">
                        <div className="shrink-0">
                            {notification.icon ? (
                                <span className="text-2xl">{notification.icon}</span>
                            ) : (
                                <Bell className="h-6 w-6 text-default-400" />
                            )}
                        </div>
                        <div className="ml-3 w-0 flex-1">
                            <p className="text-sm font-medium text-default-900">{notification.title || "Notification Title"}</p>
                            <p className="mt-1 text-sm text-default-500">{notification.body || "Notification message will appear here"}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-2">
                <Button
                    isLoading={mutation.isPending}
                    className="min-w-24"
                    color="secondary"
                    onClick={onSubmit}
                    leftIcon={<Send className="h-4 w-4" />}
                >
                    Send
                </Button>
            </div>
        </>
    );
}
