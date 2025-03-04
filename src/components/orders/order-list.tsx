"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye, MoreHorizontal, Search, ArrowUpDown } from "lucide-react";

interface Order {
    id: string;
    customer: string;
    date: string;
    total: string;
    status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
    paymentStatus: "Paid" | "Pending" | "Failed";
}

export function OrderList() {
    const [orders, setOrders] = useState<Order[]>([
        {
            id: "#ORD-001",
            customer: "John Smith",
            date: "2025-04-01",
            total: "$129.99",
            status: "Delivered",
            paymentStatus: "Paid",
        },
        {
            id: "#ORD-002",
            customer: "Sarah Johnson",
            date: "2025-04-02",
            total: "$79.50",
            status: "Processing",
            paymentStatus: "Paid",
        },
        {
            id: "#ORD-003",
            customer: "Michael Brown",
            date: "2025-04-02",
            total: "$249.99",
            status: "Shipped",
            paymentStatus: "Paid",
        },
        {
            id: "#ORD-004",
            customer: "Emily Davis",
            date: "2025-04-03",
            total: "$59.99",
            status: "Pending",
            paymentStatus: "Pending",
        },
        {
            id: "#ORD-005",
            customer: "David Wilson",
            date: "2025-04-03",
            total: "$199.00",
            status: "Cancelled",
            paymentStatus: "Failed",
        },
        {
            id: "#ORD-006",
            customer: "Jessica Martinez",
            date: "2025-04-04",
            total: "$149.99",
            status: "Processing",
            paymentStatus: "Paid",
        },
        {
            id: "#ORD-007",
            customer: "Robert Taylor",
            date: "2025-04-04",
            total: "$89.99",
            status: "Shipped",
            paymentStatus: "Paid",
        },
        {
            id: "#ORD-008",
            customer: "Jennifer Anderson",
            date: "2025-04-05",
            total: "$299.99",
            status: "Delivered",
            paymentStatus: "Paid",
        },
    ]);

    const getStatusColor = (status: Order["status"]) => {
        switch (status) {
            case "Pending":
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
            case "Processing":
                return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
            case "Shipped":
                return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
            case "Delivered":
                return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
            case "Cancelled":
                return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
            default:
                return "";
        }
    };

    const getPaymentStatusColor = (status: Order["paymentStatus"]) => {
        switch (status) {
            case "Paid":
                return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
            case "Pending":
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
            case "Failed":
                return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
            default:
                return "";
        }
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <CardTitle>Orders</CardTitle>
                        <CardDescription>Manage and process customer orders</CardDescription>
                    </div>
                    <div className="flex w-full items-center gap-2 sm:w-auto">
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input type="search" placeholder="Search orders..." className="w-full pl-8" />
                        </div>
                        <Button>Filter</Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">
                                    <div className="flex items-center gap-1">
                                        Order ID
                                        <ArrowUpDown className="h-3 w-3" />
                                    </div>
                                </TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>
                                    <div className="flex items-center gap-1">
                                        Date
                                        <ArrowUpDown className="h-3 w-3" />
                                    </div>
                                </TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Payment</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell className="font-medium">{order.id}</TableCell>
                                    <TableCell>{order.customer}</TableCell>
                                    <TableCell>{order.date}</TableCell>
                                    <TableCell>{order.total}</TableCell>
                                    <TableCell>
                                        <Badge className={getStatusColor(order.status)} variant="outline">
                                            {order.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={getPaymentStatusColor(order.paymentStatus)} variant="outline">
                                            {order.paymentStatus}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem>
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    View details
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem>Update status</DropdownMenuItem>
                                                <DropdownMenuItem>Send notification</DropdownMenuItem>
                                                <DropdownMenuItem>Print invoice</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                {/* pagination */}
            </CardContent>
        </Card>
    );
}
