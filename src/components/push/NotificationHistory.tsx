import { useState } from "react";
import { Clock, Send, Edit, Calendar, CheckCircle, AlertCircle, FileText } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { NotificationStatusEnum } from "@/schemas/notification.schema";
import { type Notification } from "@prisma/client";
import { formatDate } from "@/lib/utils";
import { api } from "@/trpc/react";
import NotificationActions from "./NotificationActions";

const NotificationHistory: React.FC = () => {
    const [res] = api.push.notifications.useSuspenseQuery();
    const notifications = res.notifications;

    const [filterStatus, setFilterStatus] = useState("all");

    const filteredNotifications = notifications.filter((notif) => filterStatus === "all" || notif.status === filterStatus);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "PUBLISHED":
                return <CheckCircle className="h-4 w-4 text-green-600" />;
            case "SCHEDULED":
                return <Clock className="h-4 w-4 text-blue-600" />;
            case "DRAFT":
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardContent className="flex items-center p-6">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <Send className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Sent</p>
                            <p className="text-2xl font-bold">
                                {notifications.filter((n) => n.status === NotificationStatusEnum.Values.PUBLISHED).length}
                            </p>
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
                            <p className="text-2xl font-bold">
                                {notifications.filter((n) => n.status === NotificationStatusEnum.Values.SCHEDULED).length}
                            </p>
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
                            <p className="text-2xl font-bold">
                                {notifications.filter((n) => n.status === NotificationStatusEnum.Values.DRAFT).length}
                            </p>
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
                            <Button
                                variant={filterStatus === "published" ? "default" : "outline"}
                                size="sm"
                                onClick={() => setFilterStatus("PUBLISHED")}
                            >
                                Published
                            </Button>
                            <Button
                                variant={filterStatus === "scheduled" ? "default" : "outline"}
                                size="sm"
                                onClick={() => setFilterStatus("SCHEDULED")}
                            >
                                Scheduled
                            </Button>
                            <Button variant={filterStatus === "draft" ? "default" : "outline"} size="sm" onClick={() => setFilterStatus("DRAFT")}>
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
                                    {/* <TableHead>Performance</TableHead> */}
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredNotifications.map((notification: Notification, idx: number) => (
                                    <TableRow key={idx}>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                {getStatusIcon(notification.status)}
                                                {getStatusBadge(notification.status)}
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium">{notification.title}</TableCell>
                                        <TableCell className="max-w-xs truncate">{notification.body}</TableCell>
                                        <TableCell>
                                            <div className="text-sm">
                                                {notification.status === NotificationStatusEnum.Values.PUBLISHED && notification.sentAt && (
                                                    <div className="text-green-600">Sent: {formatDate(notification.sentAt)}</div>
                                                )}
                                                {notification.status === NotificationStatusEnum.Values.SCHEDULED && notification.scheduledAt && (
                                                    <div className="text-blue-600">Scheduled: {formatDate(notification.scheduledAt)}</div>
                                                )}
                                                {notification.status === NotificationStatusEnum.Values.DRAFT && (
                                                    <div className="text-gray-500">Draft</div>
                                                )}
                                            </div>
                                        </TableCell>
                                        {/* <TableCell>
                                            {notification.status === NotificationStatusEnum.Values.PUBLISHED ? (
                                                <div className="text-sm space-y-1">
                                                    <div>Delivered: {notification.delivered.toLocaleString()}</div>
                                                    <div>Opened: {notification.opened.toLocaleString()}</div>
                                                    <div>Clicked: {notification.clicked.toLocaleString()}</div>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </TableCell> */}
                                        <TableCell>
                                            <NotificationActions notification={notification} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {filteredNotifications.length === 0 && notifications.length > 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6}>
                                            <div className="text-center py-12">
                                                <div className="p-3 bg-gray-50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                                    <FileText className="h-8 w-8 text-gray-400" />
                                                </div>
                                                <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
                                                <p className="text-gray-500 mb-4">
                                                    No {filterStatus === "all" ? "" : filterStatus + " "}notifications found. Try changing your filter
                                                    selection.
                                                </p>
                                                <Button variant="outline" onClick={() => setFilterStatus("all")}>
                                                    Show All Notifications
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default NotificationHistory;
