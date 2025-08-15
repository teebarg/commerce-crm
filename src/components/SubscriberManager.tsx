"use client";

import { useState } from "react";
import { Users, Search, Download, UserCheck, UserX, Globe, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const SubscriberManager = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");

    // Mock subscriber data
    const subscribers = [
        {
            id: "1",
            endpoint: "https://fcm.googleapis.com/fcm/send/ABC123...",
            userAgent: "Chrome 119.0.0.0 on Windows",
            country: "United States",
            subscribeDate: "2024-01-15",
            lastActive: "2024-01-20",
            status: "active",
            device: "desktop",
        },
        {
            id: "2",
            endpoint: "https://fcm.googleapis.com/fcm/send/DEF456...",
            userAgent: "Safari 17.0 on iPhone",
            country: "Canada",
            subscribeDate: "2024-01-18",
            lastActive: "2024-01-20",
            status: "active",
            device: "mobile",
        },
        {
            id: "3",
            endpoint: "https://fcm.googleapis.com/fcm/send/GHI789...",
            userAgent: "Firefox 120.0 on macOS",
            country: "United Kingdom",
            subscribeDate: "2024-01-10",
            lastActive: "2024-01-18",
            status: "inactive",
            device: "desktop",
        },
        {
            id: "4",
            endpoint: "https://fcm.googleapis.com/fcm/send/JKL012...",
            userAgent: "Chrome 119.0.0.0 on Android",
            country: "Germany",
            subscribeDate: "2024-01-20",
            lastActive: "2024-01-20",
            status: "active",
            device: "mobile",
        },
    ];

    const filteredSubscribers = subscribers.filter((subscriber) => {
        const matchesSearch =
            subscriber.endpoint.toLowerCase().includes(searchTerm.toLowerCase()) ||
            subscriber.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
            subscriber.userAgent.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === "all" || subscriber.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const handleExportSubscribers = () => {
        console.log("Exporting subscribers...");
        // Implement export functionality
    };

    const handleUnsubscribe = (subscriberId: string) => {
        console.log("Unsubscribing:", subscriberId);
        // Implement unsubscribe functionality
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
                            <p className="text-2xl font-bold">2,847</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="flex items-center p-6">
                        <UserCheck className="h-8 w-8 text-green-600" />
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Active</p>
                            <p className="text-2xl font-bold">2,654</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="flex items-center p-6">
                        <UserX className="h-8 w-8 text-red-600" />
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Inactive</p>
                            <p className="text-2xl font-bold">193</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="flex items-center p-6">
                        <Globe className="h-8 w-8 text-purple-600" />
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Countries</p>
                            <p className="text-2xl font-bold">47</p>
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
                                {filteredSubscribers.map((subscriber) => (
                                    <TableRow key={subscriber.id}>
                                        <TableCell className="font-mono text-xs max-w-xs truncate">{subscriber.endpoint}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                {subscriber.device === "mobile" ? (
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
