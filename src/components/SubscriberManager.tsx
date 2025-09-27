"use client";

import { useMemo, useState } from "react";
import { Users, UserCheck, UserX, Globe, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { api } from "@/trpc/react";
import { toast } from "sonner";

const SubscriberManager = () => {
    const [filterStatus, setFilterStatus] = useState("all");

    const { data, isLoading } = api.push.subscriptions.useQuery();
    const { data: events, isLoading: eventsLoading } = api.push.getEvents.useQuery();
    const mutation = api.push.processEvents.useMutation();

    const subscribers = useMemo(() => {
        const subs = data?.subscriptions ?? [];
        return subs.map((s) => {
            const lastEvent = s.NotificationEvent?.[0];
            return {
                id: s.id,
                endpoint: s.endpoint,
                userAgent: lastEvent?.userAgent ?? "Unknown",
                country: "-",
                subscribeDate: s.createdAt ? new Date(s.createdAt).toISOString().slice(0, 10) : "",
                lastActive: lastEvent?.occurredAt ? new Date(lastEvent.occurredAt).toISOString().slice(0, 10) : "-",
                status: lastEvent?.eventType ? "active" : "inactive",
                device: lastEvent?.deviceType?.toLowerCase() ?? "desktop",
            };
        });
    }, [data]);

    const filteredSubscribers = useMemo(() => {
        return (subscribers ?? []).filter((subscriber) => {
            const matchesFilter = filterStatus === "all" || subscriber.status === filterStatus;
            return matchesFilter;
        });
    }, [subscribers, filterStatus]);

    const processEvents = async (limit = 50) => {
        mutation.mutate(
            { limit },
            {
                onSuccess: (data) => {
                    toast.success(`Processed ${data.processed} events`);
                },
            }
        );
    };

    return (
        <div className="space-y-6 px-4 py-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="flex items-center p-6">
                        <Users className="h-8 w-8 text-blue-600" />
                        <div className="ml-4">
                            <p className="text-sm font-medium text-default-500">Total Subscribers</p>
                            <p className="text-2xl font-bold">{isLoading ? "-" : subscribers.length}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="flex items-center p-6">
                        <UserCheck className="h-8 w-8 text-green-600" />
                        <div className="ml-4">
                            <p className="text-sm font-medium text-default-500">Active</p>
                            <p className="text-2xl font-bold">{isLoading ? "-" : subscribers.filter((s) => s.status === "active").length}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="flex items-center p-6">
                        <UserX className="h-8 w-8 text-red-600" />
                        <div className="ml-4">
                            <p className="text-sm font-medium text-default-500">Inactive</p>
                            <p className="text-2xl font-bold">{isLoading ? "-" : subscribers.filter((s) => s.status !== "active").length}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="flex items-center justify-between gap-3 px-4">
                <CardTitle>Push Notifications</CardTitle>
                <div className="flex items-center gap-2">
                    <Button onClick={() => processEvents(10)} disabled={mutation.isPending || (events?.queueLength ?? 0) === 0} variant="default">
                        {mutation.isPending ? "Processing..." : eventsLoading ? "Loading..." : `Process Events (${events?.queueLength ?? 0})`}
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            Subscriber Management
                        </span>
                    </CardTitle>
                    <CardDescription>Manage your push notification subscribers</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <div className="flex gap-2">
                            <Button variant={filterStatus === "all" ? "default" : "outline"} size="lg" onClick={() => setFilterStatus("all")}>
                                All
                            </Button>
                            <Button variant={filterStatus === "active" ? "default" : "outline"} size="lg" onClick={() => setFilterStatus("active")}>
                                Active
                            </Button>
                            <Button
                                variant={filterStatus === "inactive" ? "default" : "outline"}
                                size="lg"
                                onClick={() => setFilterStatus("inactive")}
                            >
                                Inactive
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {filteredSubscribers.map((subscriber, idx: number) => (
                            <div
                                key={idx}
                                className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
                            >
                                <div className="flex items-center gap-4">
                                    <div>
                                        <p className="font-medium overflow-hidden text-ellipsis line-clamp-1 max-w-[50vw]">{subscriber.endpoint}</p>
                                        <div className="flex items-center gap-2">
                                            {["ios", "android"].includes(subscriber.device) ? (
                                                <Smartphone className="h-4 w-4 text-gray-500" />
                                            ) : (
                                                <Globe className="h-4 w-4 text-gray-500" />
                                            )}
                                            <span className="text-sm">{subscriber.userAgent.split(" ")[0]}</span>
                                        </div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Badge variant={subscriber.status === "active" ? "default" : "secondary"}>{subscriber.status}</Badge>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-sm">
                                    <p className="text-muted-foreground">Subscribed: {subscriber.subscribeDate}</p>
                                    <p className="text-muted-foreground">Last active: {subscriber.lastActive}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    {isLoading && (
                        <div className="text-center py-8 text-default-500">
                            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>Loading subscribers...</p>
                        </div>
                    )}

                    {!isLoading && filteredSubscribers.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No subscribers found matching your criteria.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default SubscriberManager;
