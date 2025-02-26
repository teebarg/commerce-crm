import { Cart, Package, Users } from "nui-react-icons";
import React from "react";

const StatCard = ({ icon, label, value, trend }: { icon: React.ReactNode; label: string; value: string; trend: string }) => (
    <div className="bg-content2 p-6 rounded-xl shadow-sm">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-default-500 text-sm">{label}</p>
                <h3 className="text-2xl font-bold mt-1">{value}</h3>
                <p className="text-green-600 text-sm mt-1">{trend}</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">{icon}</div>
        </div>
    </div>
);

export default async function Dashboard() {
    return (
        <div className="bg-content1 p-8 h-full">
            <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={<Users className="w-6 h-6 text-blue-600" />} label="Total Customers" value="1,234" trend="+12.5% from last month" />
                <StatCard icon={<Package className="w-6 h-6 text-blue-600" />} label="Products in Stock" value="567" trend="23 low stock alerts" />
                <StatCard icon={<Cart className="w-6 h-6 text-blue-600" />} label="Total Orders" value="890" trend="+8.2% from last month" />
                {/* <StatCard icon={<TrendingUp className="w-6 h-6 text-blue-600" />} label="Revenue" value="$12,345" trend="+15.3% from last month" /> */}
            </div>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Orders */}
                <div className="bg-content2 p-6 rounded-xl shadow-sm">
                    <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
                    <div className="space-y-4">
                        {/* We'll implement this with real data later */}
                        <p className="text-default-500">Loading recent orders...</p>
                    </div>
                </div>

                {/* Customer Satisfaction */}
                <div className="bg-content2 p-6 rounded-xl shadow-sm">
                    <h2 className="text-lg font-semibold mb-4">Customer Satisfaction</h2>
                    <div className="space-y-4">
                        {/* We'll implement this with real data later */}
                        <p className="text-default-500">Loading satisfaction metrics...</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
