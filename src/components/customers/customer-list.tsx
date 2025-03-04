"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button2";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, MoreHorizontal, ArrowUpDown, UserPlus } from "lucide-react";

interface Customer {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    initials: string;
    status: "Active" | "Inactive";
    orders: number;
    spent: string;
    lastOrder: string;
}

export function CustomerList() {
    const [customers, setCustomers] = useState<Customer[]>([
        {
            id: "1",
            name: "Olivia Martin",
            email: "olivia.martin@email.com",
            avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1761&auto=format&fit=crop&ixlib=rb-4.0.3",
            initials: "OM",
            status: "Active",
            orders: 12,
            spent: "$1,248.50",
            lastOrder: "2025-04-01",
        },
        {
            id: "2",
            name: "Jackson Lee",
            email: "jackson.lee@email.com",
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3",
            initials: "JL",
            status: "Active",
            orders: 8,
            spent: "$958.75",
            lastOrder: "2025-03-28",
        },
        {
            id: "3",
            name: "Isabella Nguyen",
            email: "isabella.nguyen@email.com",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3",
            initials: "IN",
            status: "Active",
            orders: 5,
            spent: "$429.99",
            lastOrder: "2025-03-25",
        },
        {
            id: "4",
            name: "William Kim",
            email: "will@email.com",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3",
            initials: "WK",
            status: "Inactive",
            orders: 2,
            spent: "$149.00",
            lastOrder: "2025-02-15",
        },
        {
            id: "5",
            name: "Sofia Davis",
            email: "sofia.davis@email.com",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3",
            initials: "SD",
            status: "Active",
            orders: 9,
            spent: "$849.25",
            lastOrder: "2025-03-30",
        },
    ]);

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <CardTitle>Customers</CardTitle>
                        <CardDescription>Manage your customer database</CardDescription>
                    </div>
                    <div className="flex w-full items-center gap-2 sm:w-auto">
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input type="search" placeholder="Search customers..." className="w-full pl-8" />
                        </div>
                        <Button>
                            <UserPlus className="mr-2 h-4 w-4" />
                            Add New
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Customer</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>
                                    <div className="flex items-center gap-1">
                                        Orders
                                        <ArrowUpDown className="h-3 w-3" />
                                    </div>
                                </TableHead>
                                <TableHead>
                                    <div className="flex items-center gap-1">
                                        Spent
                                        <ArrowUpDown className="h-3 w-3" />
                                    </div>
                                </TableHead>
                                <TableHead>Last Order</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {customers.map((customer) => (
                                <TableRow key={customer.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9">
                                                <AvatarImage src={customer.avatar} alt={customer.name} />
                                                <AvatarFallback>{customer.initials}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-medium">{customer.name}</div>
                                                <div className="text-sm text-muted-foreground">{customer.email}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={customer.status === "Active" ? "default" : "secondary"}>{customer.status}</Badge>
                                    </TableCell>
                                    <TableCell>{customer.orders}</TableCell>
                                    <TableCell>{customer.spent}</TableCell>
                                    <TableCell>{customer.lastOrder}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem>View profile</DropdownMenuItem>
                                                <DropdownMenuItem>View orders</DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem>Edit customer</DropdownMenuItem>
                                                <DropdownMenuItem>Send email</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                {/* Pagination */}
            </CardContent>
        </Card>
    );
}
