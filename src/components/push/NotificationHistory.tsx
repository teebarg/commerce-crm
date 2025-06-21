import { useState } from "react";
import { Clock, Send, Edit, Trash2, Play, Eye, Calendar, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { NotificationStatusEnum } from "@/schemas/notification.schema";

const NotificationHistory: React.FC = () => {
    // Mock notification history data
    const [notifications] = useState<Notification[]>([]);

    const [filterStatus, setFilterStatus] = useState("all");

    const handleSendNow = (id: string) => {
        // send notification
        toast.success("Notification Sent", {
            description: "The scheduled notification has been sent immediately.",
        });
    };

    const handleDelete = (id: string) => {
        // delete notification
        toast.error("Notification Deleted", {
            description: "The notification has been removed from your history.",
        });
    };

    const handleEdit = (id: string) => {
        // edit notification
        toast.error("Edit Mode", {
            description: "Notification editing functionality would open here.",
        });
    };

    const filteredNotifications = notifications.filter((notif) => filterStatus === "all" || notif.status === filterStatus);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "sent":
                return <CheckCircle className="h-4 w-4 text-green-600" />;
            case "scheduled":
                return <Clock className="h-4 w-4 text-blue-600" />;
            case "draft":
                return <Edit className="h-4 w-4 text-gray-600" />;
            default:
                return <AlertCircle className="h-4 w-4 text-orange-600" />;
        }
    };

    const getStatusBadge = (status: NotificationStatusEnum) => {
        const variants: Record<NotificationStatusEnum, "outline" | "secondary" | "emerald"> = {
            DRAFT: "outline",
            SCHEDULED: "secondary",
            PUBLISHED: "emerald",
        };
        return (
            <Badge variant={variants[status]} className="capitalize">
                {status}
            </Badge>
        );
    };

    return (
        <div className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardContent className="flex items-center p-6">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <Send className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Sent</p>
                            <p className="text-2xl font-bold">{notifications.filter((n) => n.status === "sent").length}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="flex items-center p-6">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Clock className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Scheduled</p>
                            <p className="text-2xl font-bold">{notifications.filter((n) => n.status === "scheduled").length}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="flex items-center p-6">
                        <div className="p-2 bg-gray-100 rounded-lg">
                            <Edit className="h-6 w-6 text-gray-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Drafts</p>
                            <p className="text-2xl font-bold">{notifications.filter((n) => n.status === "draft").length}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filter and History */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-purple-600" />
                                Notification History
                            </CardTitle>
                            <CardDescription>View and manage your sent and scheduled notifications</CardDescription>
                        </div>
                        <div className="flex gap-2">
                            <Button variant={filterStatus === "all" ? "default" : "outline"} size="sm" onClick={() => setFilterStatus("all")}>
                                All
                            </Button>
                            <Button variant={filterStatus === "sent" ? "default" : "outline"} size="sm" onClick={() => setFilterStatus("sent")}>
                                Sent
                            </Button>
                            <Button
                                variant={filterStatus === "scheduled" ? "default" : "outline"}
                                size="sm"
                                onClick={() => setFilterStatus("scheduled")}
                            >
                                Scheduled
                            </Button>
                            <Button variant={filterStatus === "draft" ? "default" : "outline"} size="sm" onClick={() => setFilterStatus("draft")}>
                                Drafts
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Message</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Recipients</TableHead>
                                    <TableHead>Performance</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredNotifications.map((notification, idx: number) => (
                                    <TableRow key={idx}>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                {getStatusIcon(notification.status)}
                                                {getStatusBadge(notification.status)}
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium">{notification.title}</TableCell>
                                        <TableCell className="max-w-xs truncate">{notification.message}</TableCell>
                                        <TableCell>
                                            <div className="text-sm">
                                                {notification.status === NotificationStatusEnum.Values.PUBLISHED && notification.sentDate && (
                                                    <div className="text-green-600">Sent: {notification.sentDate}</div>
                                                )}
                                                {notification.status === NotificationStatusEnum.Values.SCHEDULED && notification.scheduledDate && (
                                                    <div className="text-blue-600">Scheduled: {notification.scheduledDate}</div>
                                                )}
                                                {notification.status === NotificationStatusEnum.Values.DRAFT && <div className="text-gray-500">Draft</div>}
                                            </div>
                                        </TableCell>
                                        <TableCell>{notification.recipients.toLocaleString()}</TableCell>
                                        <TableCell>
                                            {notification.status === "sent" ? (
                                                <div className="text-sm space-y-1">
                                                    <div>Delivered: {notification.delivered.toLocaleString()}</div>
                                                    <div>Opened: {notification.opened.toLocaleString()}</div>
                                                    <div>Clicked: {notification.clicked.toLocaleString()}</div>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                {notification.status === "scheduled" && (
                                                    <>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleSendNow(notification.id)}
                                                            className="h-8 px-2"
                                                        >
                                                            <Play className="h-3 w-3" />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleEdit(notification.id)}
                                                            className="h-8 px-2"
                                                        >
                                                            <Edit className="h-3 w-3" />
                                                        </Button>
                                                    </>
                                                )}
                                                {notification.status === "draft" && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleEdit(notification.id)}
                                                        className="h-8 px-2"
                                                    >
                                                        <Edit className="h-3 w-3" />
                                                    </Button>
                                                )}
                                                {notification.status === "sent" && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleEdit(notification.id)}
                                                        className="h-8 px-2"
                                                    >
                                                        <Eye className="h-3 w-3" />
                                                    </Button>
                                                )}
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleDelete(notification.id)}
                                                    className="h-8 px-2 text-red-600 hover:text-red-700"
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default NotificationHistory;
