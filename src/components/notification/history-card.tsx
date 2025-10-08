import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { type Notification } from "@prisma/client";
import { NotificationStatusEnum } from "@/schemas/notification.schema";
import NotificationActions from "../push/NotificationActions";
import { Link as LinkIcon } from "lucide-react";
import { api } from "@/trpc/react";
import Image from "next/image";

export const HistoryCard = ({ notification }: { notification: Notification }) => {
    const { data: metrics } = api.push.notificationMetrics.useQuery(notification.id);
    const recipients = (notification.sentCount ?? 0) + (notification.failedCount ?? 0);
    const delivered = metrics?.delivered ?? notification.sentCount ?? 0;
    const opened = metrics?.opened ?? 0;
    const dismissed = metrics?.dismissed ?? 0;
    const deliveryRate = recipients > 0 ? Math.round((delivered / recipients) * 100) : 0;
    const openRate = delivered > 0 ? Math.round((opened / delivered) * 100) : 0;
    const dismissRate = delivered > 0 ? Math.round((dismissed / delivered) * 100) : 0;
    const getStatusVariant = (status: NotificationStatusEnum) => {
        switch (status) {
            case "PUBLISHED":
                return "emerald";
            case "SCHEDULED":
                return "default";
            case "DRAFT":
                return "secondary";
            default:
                return "default";
        }
    };

    return (
        <Card className="shadow-soft hover:shadow-medium transition-smooth">
            <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg truncate">{notification.title}</h3>
                            <Badge variant={getStatusVariant(notification.status)}>{notification.status}</Badge>
                        </div>

                        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{notification.body}</p>

                        {(() => {
                            const data: any = notification.data as any;
                            const actionUrl: string | undefined = data?.actionUrl;
                            if (!actionUrl || typeof actionUrl !== "string") return null;
                            return (
                                <div className="mb-3 flex items-center gap-2 text-sm">
                                    <LinkIcon className="h-4 w-4 text-blue-600" />
                                    <p className="text-blue-600 break-all">{actionUrl}</p>
                                </div>
                            );
                        })()}

                        {notification.imageUrl && (
                            <div className="mb-3 relative h-32 w-full">
                                <Image
                                    src={notification.imageUrl}
                                    alt="notification"
                                    fill
                                    className="object-contain rounded-md border"
                                    sizes="(max-width: 768px) 100vw, 600px"
                                    unoptimized
                                />
                            </div>
                        )}

                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                            <div>
                                <p className="text-muted-foreground">Audience</p>
                                <p className="font-medium">All Subscribers</p>
                            </div>

                            <div>
                                <p className="text-muted-foreground">Recipients</p>
                                <p className="font-medium">{recipients.toLocaleString()}</p>
                            </div>

                            <div>
                                <p className="text-muted-foreground">Open Rate</p>
                                <p className="font-medium">{notification.status === NotificationStatusEnum.Values.PUBLISHED ? `${openRate}%` : "-"}</p>
                            </div>

                            <div>
                                <p className="text-muted-foreground">Delivery Rate</p>
                                <p className="font-medium">{notification.status === NotificationStatusEnum.Values.PUBLISHED ? `${deliveryRate}%` : "-"}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Dismiss Rate</p>
                                <p className="font-medium">{notification.status === NotificationStatusEnum.Values.PUBLISHED ? `${dismissRate}%` : "-"}</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between mt-4 pt-4 border-t">
                            <div className="text-sm">
                                {notification.status === NotificationStatusEnum.Values.PUBLISHED && notification.sentAt && (
                                    <div className="text-green-600">Sent: {formatDistanceToNow(notification.sentAt, { addSuffix: true })}</div>
                                )}
                                {notification.status === NotificationStatusEnum.Values.SCHEDULED && notification.scheduledAt && (
                                    <div className="text-blue-600">
                                        Scheduled: {formatDistanceToNow(notification.scheduledAt, { addSuffix: true })}
                                    </div>
                                )}
                                {notification.status === NotificationStatusEnum.Values.DRAFT && <div className="text-muted-foreground">Draft</div>}
                            </div>

                            <NotificationActions notification={notification} />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
