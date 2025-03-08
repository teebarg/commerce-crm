import { Package, Users } from "nui-react-icons";
import React from "react";
import { StatCard } from "@/components/dashboard/stat-card";
import { RecentSales } from "@/components/dashboard/recent-sales";
import { OverviewChart } from "@/components/dashboard/overview-chart";
import { ShoppingCart, DollarSign, TrendingUp } from "lucide-react";

export default async function Dashboard() {
    return (
        <div className="bg-content1p p-8 h-full">
            <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Revenue"
                    value="$45,231.89"
                    description="Monthly revenue"
                    icon={<DollarSign className="h-4 w-4" />}
                    trend="up"
                    trendValue="12.5%"
                />
                <StatCard
                    title="Orders"
                    value="1,234"
                    description="Total orders this month"
                    icon={<ShoppingCart className="h-4 w-4" />}
                    trend="up"
                    trendValue="8.2%"
                />
                <StatCard
                    title="Customers"
                    value="573"
                    description="Active customers"
                    icon={<Users className="h-4 w-4" />}
                    trend="up"
                    trendValue="5.7%"
                />
                <StatCard
                    title="Products"
                    value="248"
                    description="Active products"
                    icon={<Package className="h-4 w-4" />}
                    trend="neutral"
                    trendValue="0%"
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2 my-4">
                <OverviewChart />
                <RecentSales />
            </div>
        </div>
    );
}
