"use client";

import { useState } from "react";
import { Clock, Send, Edit, Calendar, FileText } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NotificationStatusEnum } from "@/schemas/notification.schema";
import { type Notification } from "@prisma/client";
import { api } from "@/trpc/react";
import { HistoryCard } from "../notification/history-card";

const NotificationHistory: React.FC = () => {
    const [res] = api.push.notifications.useSuspenseQuery();
    const notifications = res.notifications;

    const [filterStatus, setFilterStatus] = useState<string>("all");

    const filteredNotifications = notifications.filter((notif) => filterStatus === "all" || notif.status === filterStatus);

    return (
        <div className="space-y-6 px-4 py-2">
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

            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4">
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
                    <div className="space-y-4">
                        {filteredNotifications.map((notification: Notification, idx: number) => (
                            <HistoryCard key={idx} notification={notification} />
                        ))}
                    </div>
                    {filteredNotifications.length === 0 && (
                        <div className="text-center py-12">
                            <div className="p-3 bg-accent/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                <FileText className="h-8 w-8 text-accent" />
                            </div>
                            <h3 className="text-lg font-medium text-default-600 mb-2">No notifications found</h3>
                            <p className="text-gray-500 mb-4">
                                No {filterStatus === "all" ? "" : filterStatus + " "}notifications found. Try changing your filter selection.
                            </p>
                            <Button variant="outline" onClick={() => setFilterStatus("all")}>
                                Show All Notifications
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default NotificationHistory;
