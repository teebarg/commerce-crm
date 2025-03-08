"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, ArrowUpDown, UserPlus } from "lucide-react";
import { Role, Status } from "@prisma/client";
import { ExtendedUser, Pagination } from "@/types/generic";
import { AnimatePresence, motion } from "framer-motion";
import { useOverlayTriggerState } from "react-stately";
import DrawerUI from "../drawer";
import PaginationUI from "../pagination";
import { UserActions } from "./customer-actions";
import UserForm from "./user-form";

interface CustomerListProps {
    users: ExtendedUser[];
    pagination: Pagination;
}

export const CustomerList: React.FC<CustomerListProps> = ({ users, pagination }) => {
    const addState = useOverlayTriggerState({});
    const [isVisible, setIsVisible] = useState<boolean>(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const getStatusColor = (status: Status | null) => {
        switch (status) {
            case Status.ACTIVE:
                return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
            case Status.PENDING:
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
            case Status.INACTIVE:
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
                        <CardTitle>Customers</CardTitle>
                        <CardDescription>Manage your customer database</CardDescription>
                    </div>
                    <div className="flex w-full items-center gap-2 sm:w-auto">
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input type="search" placeholder="Search customers..." className="w-full pl-8" />
                        </div>
                        <DrawerUI
                            open={addState.isOpen}
                            onOpenChange={addState.setOpen}
                            direction="right"
                            title="Create User"
                            trigger={
                                <span className="h-10 rounded-md px-8 bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center text-sm font-medium transition-colors focus-visible:outline-none">
                                    <UserPlus className="mr-2 h-4 w-4" /> Add Product
                                </span>
                            }
                        >
                            <UserForm onClose={addState.close} />
                        </DrawerUI>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <AnimatePresence>
                    {isVisible && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Customer</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>
                                            <div className="flex items-center gap-1">
                                                Orders
                                                <ArrowUpDown className="h-3 w-3" />
                                            </div>
                                        </TableHead>
                                        <TableHead>Last Order</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.map((user: ExtendedUser, idx: number) => (
                                        <TableRow key={idx}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-9 w-9">
                                                        <AvatarImage src={user.image ?? ""} alt={user.firstName + " " + user.lastName} />
                                                        <AvatarFallback>{user.firstName?.charAt(0) + user.lastName!.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <div className="font-medium">{user.firstName + " " + user.lastName}</div>
                                                        <div className="text-sm text-muted-foreground">{user.email}</div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={user.role == Role.ADMIN ? "default" : "secondary"}>{user.role.toLowerCase()}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={getStatusColor(user.status)} variant="outline">
                                                    {user.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{user.orders.length}</TableCell>
                                            <TableCell>{user.orders[user.orders.length - 1]?.created_at.toLocaleDateString() ?? "N/A"}</TableCell>
                                            <TableCell className="text-right">
                                                <UserActions user={user} />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            {/* Pagination */}
                            <PaginationUI pagination={pagination} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </CardContent>
        </Card>
    );
};
