"use client";

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
import { OrderStatus, PaymentStatus } from "@prisma/client";
import { ExtendedOrder, type Pagination } from "@/types/generic";
import PaginationUI from "@/components/pagination";


export function OrderList({ orders, pagination }: { orders: ExtendedOrder[]; pagination: Pagination }) {
    const getStatusColor = (status: OrderStatus) => {
        switch (status) {
            case OrderStatus.PENDING:
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
            case OrderStatus.PROCESSING:
                return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
            case OrderStatus.SHIPPED:
                return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
            case OrderStatus.DELIVERED:
                return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
            case OrderStatus.CANCELED:
                return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
            default:
                return "";
        }
    };

    const getPaymentStatusColor = (status: PaymentStatus | null) => {
        switch (status) {
            case PaymentStatus.COMPLETED:
                return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
            case PaymentStatus.PENDING:
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
            case PaymentStatus.FAILED:
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
                            {orders.map((order: ExtendedOrder, index: number) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium">{order.order_number}</TableCell>
                                    <TableCell>
                                        {order.user.firstName} {order.user.lastName}
                                    </TableCell>
                                    <TableCell>
                                        <span>{new Date(order.created_at).toLocaleDateString()}</span>
                                    </TableCell>
                                    <TableCell>{order.total}</TableCell>
                                    <TableCell>
                                        <Badge className={getStatusColor(order.status)} variant="outline">
                                            {order.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={getPaymentStatusColor(order.payment_status)} variant="outline">
                                            {order.payment_status}
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
                {pagination && pagination?.totalPages > 1 && <PaginationUI pagination={pagination} />}
            </CardContent>
        </Card>
    );
}
