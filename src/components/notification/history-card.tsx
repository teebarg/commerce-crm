import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { type Notification } from "@prisma/client";
import { NotificationStatusEnum } from "@/schemas/notification.schema";
import NotificationActions from "../push/NotificationActions";

export const HistoryCard = ({ notification }: { notification: Notification }) => {
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

                        {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                                <p className="text-muted-foreground">Audience</p>
                                <p className="font-medium">{item.audience}</p>
                            </div>

                            <div>
                                <p className="text-muted-foreground">Recipients</p>
                                <p className="font-medium">{item.recipients.toLocaleString()}</p>
                            </div>

                            <div>
                                <p className="text-muted-foreground">Open Rate</p>
                                <p className="font-medium">{item.status === "sent" ? `${item.openRate}%` : "-"}</p>
                            </div>

                            <div>
                                <p className="text-muted-foreground">Click Rate</p>
                                <p className="font-medium">{item.status === "sent" ? `${item.clickRate}%` : "-"}</p>
                            </div>
                        </div> */}

                        <div className="flex items-center justify-between mt-4 pt-4 border-t">
                            <div className="text-sm">
                                {notification.status === NotificationStatusEnum.Values.PUBLISHED && notification.sentAt && (
                                    <div className="text-green-600">Sent: {formatDistanceToNow(notification.sentAt, { addSuffix: true })}</div>
                                )}
                                {notification.status === NotificationStatusEnum.Values.SCHEDULED && notification.scheduledAt && (
                                    <div className="text-blue-600">Scheduled: {formatDistanceToNow(notification.scheduledAt, { addSuffix: true })}</div>
                                )}
                                {notification.status === NotificationStatusEnum.Values.DRAFT && <div className="text-gray-500">Draft</div>}
                            </div>

                            <NotificationActions notification={notification} />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
