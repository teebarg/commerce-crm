"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

interface Sale {
    id: string;
    customer: {
        name: string;
        email: string;
        avatar?: string;
        initials: string;
    };
    amount: string;
    date: string;
}

export function RecentSales() {
    const [isVisible, setIsVisible] = useState(false);
    const [sales, setSales] = useState<Sale[]>([
        {
            id: "1",
            customer: {
                name: "Olivia Martin",
                email: "olivia.martin@email.com",
                avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1761&auto=format&fit=crop&ixlib=rb-4.0.3",
                initials: "OM",
            },
            amount: "$1,999.00",
            date: "Just now",
        },
        {
            id: "2",
            customer: {
                name: "Jackson Lee",
                email: "jackson.lee@email.com",
                avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3",
                initials: "JL",
            },
            amount: "$39.00",
            date: "2 minutes ago",
        },
        {
            id: "3",
            customer: {
                name: "Isabella Nguyen",
                email: "isabella.nguyen@email.com",
                avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3",
                initials: "IN",
            },
            amount: "$299.00",
            date: "3 hours ago",
        },
        {
            id: "4",
            customer: {
                name: "William Kim",
                email: "will@email.com",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3",
                initials: "WK",
            },
            amount: "$99.00",
            date: "Yesterday",
        },
        {
            id: "5",
            customer: {
                name: "Sofia Davis",
                email: "sofia.davis@email.com",
                avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3",
                initials: "SD",
            },
            amount: "$149.00",
            date: "2 days ago",
        },
    ]);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Sales</CardTitle>
                <CardDescription>You made {sales.length} sales this period.</CardDescription>
            </CardHeader>
            <CardContent>
                <AnimatePresence>
                    {isVisible && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ staggerChildren: 0.1 }} className="space-y-8">
                            {sales.map((sale, index) => (
                                <motion.div
                                    key={sale.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex items-center"
                                >
                                    <Avatar className="h-9 w-9">
                                        <AvatarImage src={sale.customer.avatar} alt="Avatar" />
                                        <AvatarFallback>{sale.customer.initials}</AvatarFallback>
                                    </Avatar>
                                    <div className="ml-4 space-y-1">
                                        <p className="text-sm font-medium leading-none">{sale.customer.name}</p>
                                        <p className="text-sm text-muted-foreground">{sale.customer.email}</p>
                                    </div>
                                    <div className="ml-auto font-medium">{sale.amount}</div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </CardContent>
        </Card>
    );
}
