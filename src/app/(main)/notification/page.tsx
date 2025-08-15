import { RecentActivity } from "@/components/notification/recent-activity";
import { StatsCard } from "@/components/notification/stats-card";
import { Users, Send, TrendingUp, Bell } from "lucide-react";

export default function Notification() {
    return (
        <div className="container mx-auto px-4 py-6">
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground">Overview of your push notification campaigns and subscribers</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatsCard
                        title="Total Subscribers"
                        value="2,453"
                        change="+12.5%"
                        changeType="positive"
                        icon={Users}
                        description="from last month"
                    />
                    <StatsCard title="Notifications Sent" value="8,432" change="+8.2%" changeType="positive" icon={Send} description="this month" />
                    <StatsCard title="Open Rate" value="24.8%" change="+2.1%" changeType="positive" icon={TrendingUp} description="average" />
                    <StatsCard title="Active Campaigns" value="12" change="3 new" changeType="neutral" icon={Bell} description="running" />
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <RecentActivity />
                    </div>
                    <div className="space-y-4">
                        <div className="bg-gradient-primary rounded-lg p-6 text-white">
                            <h3 className="text-lg font-semibold mb-2">Quick Send</h3>
                            <p className="text-sm opacity-90 mb-4">Send an instant notification to all your subscribers</p>
                            <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition-smooth">
                                Create Notification
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
