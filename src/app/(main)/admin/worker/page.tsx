"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { type QueueStats } from "@/trpc/schema";

export default function WorkerPage() {
    const [stats, setStats] = useState<QueueStats | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [processing, setProcessing] = useState<boolean>(false);

    useEffect(() => {
        void fetchStats();
    }, []);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/worker/email");
            if (response.ok) {
                const data = await response.json();
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                setStats(data);
            }
        } catch (error) {
            toast.error(`${error}`);
        } finally {
            setLoading(false);
        }
    };

    const processEvents = async (limit = 50) => {
        setProcessing(true);
        try {
            const response = await fetch("/api/worker/email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ limit }),
            });

            if (response.ok) {
                await response.json();
                // Refresh stats after processing
                await fetchStats();
            }
        } catch (error) {
            toast.error(`${error}`);
        } finally {
            setProcessing(false);
        }
    };

    const formatTimestamp = (timestamp: number) => {
        return new Date(timestamp).toLocaleString();
    };

    const getEventTypeColor = (type: string) => {
        switch (type) {
            case "EMAIL_DELIVERED":
                return "bg-green-100 text-green-800";
            case "EMAIL_OPENED":
                return "bg-blue-100 text-blue-800";
            case "EMAIL_CLICKED":
                return "bg-purple-100 text-purple-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Worker Dashboard</h1>
                <div className="space-x-2">
                    <Button onClick={fetchStats} disabled={loading}>
                        {loading ? "Refreshing..." : "Refresh Stats"}
                    </Button>
                    <Button onClick={() => processEvents(50)} disabled={processing || (stats?.queueLength ?? 0) === 0} variant="default">
                        {processing ? "Processing..." : "Process Events (50)"}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Queue Status</CardTitle>
                        <CardDescription>Current events in Redis queue</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loading ? <Skeleton className="h-8 w-16" /> : <div className="text-3xl font-bold">{stats?.queueLength ?? 0}</div>}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Actions</CardTitle>
                        <CardDescription>Manual queue management</CardDescription>
                    </CardHeader>
                    <CardContent className="space-x-2">
                        <Button
                            onClick={() => processEvents(10)}
                            disabled={processing || (stats?.queueLength ?? 0) === 0}
                            size="sm"
                            variant="outline"
                        >
                            Process 10 Events
                        </Button>
                        <Button
                            onClick={() => processEvents(100)}
                            disabled={processing || (stats?.queueLength ?? 0) === 0}
                            size="sm"
                            variant="outline"
                        >
                            Process 100 Events
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Sample Events</CardTitle>
                    <CardDescription>First 5 events in the queue</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="space-y-2">
                            {[1, 2, 3].map((i) => (
                                <Skeleton key={i} className="h-16 w-full" />
                            ))}
                        </div>
                    ) : stats && stats.queueLength > 0 ? (
                        <div className="space-y-3">
                            {stats.sampleEvents.map(({ id, data: event }, index) => (
                                <div key={id ?? index} className="p-3 border rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                        <Badge className={getEventTypeColor(event.type)}>{event.type}</Badge>
                                        {event.timestamp && <span className="text-sm text-gray-500">{formatTimestamp(event.timestamp)}</span>}
                                    </div>
                                    <div className="text-sm space-y-1">
                                        {event.campaignId && (
                                            <div>
                                                <strong>Campaign:</strong> {event.campaignId}
                                            </div>
                                        )}
                                        {event.recipient && (
                                            <div>
                                                <strong>Recipient:</strong> {event.recipient}
                                            </div>
                                        )}
                                        {event.email && (
                                            <div>
                                                <strong>Email:</strong> {event.email}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-gray-500 text-center py-8">No events in queue</div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
