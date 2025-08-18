import { Edit, Trash2, Play, RefreshCw, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { NotificationStatusEnum } from "@/schemas/notification.schema";
import { type Notification } from "@prisma/client";
import { api } from "@/trpc/react";
import Overlay from "@/components/overlay";
import { useOverlayTriggerState } from "@react-stately/overlays";
import { NotificationForm } from "@/components/notification/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Confirm } from "@/components/ui/confirm";

interface NotificationActionsProps {
    notification: Notification;
}

const NotificationActions: React.FC<NotificationActionsProps> = ({ notification }) => {
    const editState = useOverlayTriggerState({});
    const deleteState = useOverlayTriggerState({});
    const utils = api.useUtils();

    const mutation = api.push.notify.useMutation({
        onSuccess: async () => {
            toast.success("Notification Sent!", {
                description: "The scheduled notification has been sent immediately.",
            });
            await utils.push.invalidate();
        },
        onError: (error: unknown) => {
            toast.error(`Error - ${error as string}`);
        },
    });

    const deleteMutation = api.push.deleteNotification.useMutation({
        onSuccess: async () => {
            toast.success("Notification Deleted", {
                description: "The notification has been removed from your history.",
            });
            await utils.push.invalidate();
            deleteState.close();
        },
        onError: (error: unknown) => {
            toast.error(`Error - ${error as string}`);
        },
    });

    const duplicateMutation = api.push.createNotification.useMutation({
        onSuccess: async () => {
            toast.success("Notification duplicated", {
                description: "A draft copy has been created.",
            });
            await utils.push.invalidate();
        },
        onError: (error: unknown) => {
            toast.error(`Error - ${error as string}`);
        },
    });

    const handleSendNow = (): void => {
        mutation.mutate({
            title: notification.title,
            body: notification.body,
            group: "bot",
            id: notification.id,
            imageUrl: notification.imageUrl,
            data: notification.data,
        });
    };

    const handleDuplicate = (): void => {
        duplicateMutation.mutate({
            title: notification.title,
            body: notification.body,
            imageUrl: notification.imageUrl ?? undefined,
            data: notification.data as any,
            status: "DRAFT",
        });
    };

    return (
        <div className="flex items-center gap-2">
            {notification.status === NotificationStatusEnum.Values.PUBLISHED && (
                <Button size="icon" onClick={handleSendNow} variant="outline">
                    <RefreshCw className="h-3 w-3" />
                </Button>
            )}
            {notification.status !== NotificationStatusEnum.Values.PUBLISHED && (
                <>
                    <Button size="icon" variant="outline" onClick={handleSendNow}>
                        <Play className="h-3 w-3" />
                    </Button>
                    <Overlay
                        open={editState.isOpen}
                        title={`Edit ${notification.title}`}
                        trigger={
                            <Button size="icon" variant="outline">
                                <Edit className="h-3 w-3" />
                            </Button>
                        }
                        onOpenChange={editState.setOpen}
                    >
                        <NotificationForm notification={notification} onClose={editState.close} />
                    </Overlay>
                </>
            )}
            <Button size="icon" variant="outline" onClick={handleDuplicate} disabled={duplicateMutation.isPending}>
                <Copy className="h-3 w-3" />
            </Button>
            <Dialog open={deleteState.isOpen} onOpenChange={deleteState.setOpen}>
                <DialogTrigger asChild>
                    <Button size="icon" variant="outline" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-3 w-3" />
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader className="sr-only">
                        <DialogTitle>{`Delete ${notification.title}`}</DialogTitle>
                    </DialogHeader>
                    <Confirm
                        onClose={deleteState.close}
                        onConfirm={() => void deleteMutation.mutate(notification.id)}
                        isLoading={deleteMutation.isPending}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default NotificationActions;
