"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/utils/utils";
import { motion } from "framer-motion";

interface StatCardProps {
    title: string;
    value: string;
    description?: string;
    icon: React.ReactNode;
    className?: string;
    trend?: "up" | "down" | "neutral";
    trendValue?: string;
}

export function StatCard({ title, value, description, icon, className, trend, trendValue }: StatCardProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }} transition={{ duration: 0.3 }}>
            <Card className={cn("overflow-hidden", className)}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{title}</CardTitle>
                    <div className="h-4 w-4 text-muted-foreground">{icon}</div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{value}</div>
                    {description && <p className="text-xs text-muted-foreground">{description}</p>}
                    {trend && trendValue && (
                        <div className="mt-2 flex items-center text-xs">
                            <span className={cn("mr-1", trend === "up" && "text-green-500", trend === "down" && "text-red-500")}>
                                {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"}
                            </span>
                            <span className={cn(trend === "up" && "text-green-500", trend === "down" && "text-red-500")}>{trendValue}</span>
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
}
