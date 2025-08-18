"use client";

import { useMemo, useState } from "react";
import { Users, Search, Download, UserCheck, UserX, Globe, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api } from "@/trpc/react";

const SubscriberManager = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");

    const { data, isLoading } = api.push.subscriptions.useQuery();
    const utils = api.useUtils();
    const unsubscribeMutation = api.push.unsubscribe.useMutation({
        onSuccess: () => {
            void utils.push.subscriptions.invalidate();
        },
    });

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
        const term = searchTerm.toLowerCase();
        return (subscribers ?? []).filter((subscriber) => {
            const matchesSearch =
                subscriber.endpoint.toLowerCase().includes(term) ||
                subscriber.userAgent.toLowerCase().includes(term);
            const matchesFilter = filterStatus === "all" || subscriber.status === filterStatus;
            return matchesSearch && matchesFilter;
        });
    }, [subscribers, searchTerm, filterStatus]);

    const handleExportSubscribers = () => {
        console.log("Exporting subscribers...");
        // Implement export functionality
    };

    const handleUnsubscribe = async (subscriberId: string) => {
        await unsubscribeMutation.mutateAsync(subscriberId);
    };

    return (
        <div className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="flex items-center p-6">
                        <Users className="h-8 w-8 text-blue-600" />
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Subscribers</p>
                            <p className="text-2xl font-bold">{isLoading ? "-" : subscribers.length}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="flex items-center p-6">
                        <UserCheck className="h-8 w-8 text-green-600" />
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Active</p>
                            <p className="text-2xl font-bold">{isLoading ? "-" : subscribers.filter((s) => s.status === "active").length}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="flex items-center p-6">
                        <UserX className="h-8 w-8 text-red-600" />
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Inactive</p>
                            <p className="text-2xl font-bold">{isLoading ? "-" : subscribers.filter((s) => s.status !== "active").length}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="flex items-center p-6">
                        <Globe className="h-8 w-8 text-purple-600" />
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Countries</p>
                            <p className="text-2xl font-bold">{isLoading ? "-" : new Set(subscribers.map((s) => s.country).filter((c) => c && c !== "-")).size}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Subscriber Management */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            Subscriber Management
                        </span>
                        <Button onClick={handleExportSubscribers} variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Export
                        </Button>
                    </CardTitle>
                    <CardDescription>Manage your push notification subscribers</CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Search and Filter */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search subscribers..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button variant={filterStatus === "all" ? "default" : "outline"} size="sm" onClick={() => setFilterStatus("all")}>
                                All
                            </Button>
                            <Button variant={filterStatus === "active" ? "default" : "outline"} size="sm" onClick={() => setFilterStatus("active")}>
                                Active
                            </Button>
                            <Button
                                variant={filterStatus === "inactive" ? "default" : "outline"}
                                size="sm"
                                onClick={() => setFilterStatus("inactive")}
                            >
                                Inactive
                            </Button>
                        </div>
                    </div>

                    {/* Subscribers Table */}
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Endpoint</TableHead>
                                    <TableHead>Device/Browser</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Subscribed</TableHead>
                                    <TableHead>Last Active</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={7}>Loading...</TableCell>
                                    </TableRow>
                                ) : filteredSubscribers.map((subscriber) => (
                                    <TableRow key={subscriber.id}>
                                        <TableCell className="font-mono text-xs max-w-xs truncate">{subscriber.endpoint}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                {(["ios", "android"].includes(subscriber.device)) ? (
                                                    <Smartphone className="h-4 w-4 text-gray-500" />
                                                ) : (
                                                    <Globe className="h-4 w-4 text-gray-500" />
                                                )}
                                                <span className="text-sm">{subscriber.userAgent.split(" ")[0]}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{subscriber.country}</TableCell>
                                        <TableCell>{subscriber.subscribeDate}</TableCell>
                                        <TableCell>{subscriber.lastActive}</TableCell>
                                        <TableCell>
                                            <Badge variant={subscriber.status === "active" ? "default" : "secondary"}>{subscriber.status}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleUnsubscribe(subscriber.id)}
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                <UserX className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {filteredSubscribers.length === 0 && (
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
